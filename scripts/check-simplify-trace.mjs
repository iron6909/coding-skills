import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const targets = { "stable-scope": "labels.mjs", "docs-only": "README.md", "existing-reuse": "caller.mjs", contracts: "contracts.mjs", "mutation-boundary": "target.mjs", "no-gain": "target.mjs", "rejected-batch": "target.mjs", "dirty-baseline": "target.mjs" };

const parseJSON = source => {
  try { return JSON.parse(source); }
  catch { throw new SyntaxError("Invalid JSON in native simplify trace"); }
};

// Local native-trace evidence only; ambiguous same-call ordering remains unverified.
export function checkTrace(events, variant) {
  assert.ok(Object.hasOwn(targets, variant), "unknown simplify fixture");
  assert.ok(Array.isArray(events) && events.length > 0, "expected nonempty native JSONL events");
  const results = new Map(events.map((event, index) => [event.toolCallId, { ...event, index }]).filter(([, event]) => event.recordType === "message" && event.role === "toolResult"));
  const calls = events.flatMap((event, index) => {
    assert.ok(event && typeof event === "object", "invalid native event");
    if (event.recordType !== "tool_start") return [];
    assert.equal(typeof event.toolName, "string");
    assert.equal(typeof event.toolCallId, "string");
    const args = parseJSON(event.argsPayload);
    assert.ok(args && typeof args === "object" && !Array.isArray(args));
    const result = results.get(event.toolCallId);
    assert.ok(result && result.index > index, "missing completed tool result");
    return [{ ...event, index, args, result, input: JSON.stringify(args).replaceAll("\\\\", "/"), output: result.text ?? "" }];
  });
  assert.ok(calls.length > 0, "trace contains no completed tool calls");
  const source = calls.filter(call => !call.result.isError && ((call.toolName === "read" && call.args.path?.replaceAll("\\", "/").split("/").at(-1) === targets[variant]) || (/\b(cat|type|rg|git diff)\b/.test(call.args.command ?? "") && (call.args.command ?? "").includes(targets[variant]))));
  const checks = calls.filter(call => /\bnode(?:\.exe)?\s+["']?(?:\.\/)?check\.mjs\b/.test(call.args.command ?? ""));
  const passed = checks.filter(call => !call.result.isError && /\bchecks? passed\b/.test(call.output) && !/AssertionError|Command exited with code [1-9]/.test(call.output));
  const reviews = calls.filter(call => /references\/(simplify-dimensions|complexity-metrics|severity)\.md/.test(call.input));
  const commitCalls = calls.filter(call => /\bgit\s+(?:-[Cc]\s+\S+\s+)*commit\b/.test(call.args.command ?? ""));
  const edits = calls.filter(call => ["edit", "write"].includes(call.toolName));
  const changes = edits.filter(call => !call.result.isError);
  const questions = calls.filter(call => call.toolName === "contact_supervisor" && ["need_decision", "interview_request"].includes(call.args.reason));
  const docs = variant === "docs-only", dirty = variant === "dirty-baseline";
  let applicable = passed.length > 0 && reviews.some(call => call.input.includes("simplify-dimensions.md"));
  if (docs) applicable = checks.length === 0;
  else if (dirty) applicable = checks.length === 1 && checks[0].output.includes("pre-existing fixture failure");
  const engagement = source.length > 0 && applicable;
  const baselineFirst = docs || dirty ? edits.length === 0 : edits.every(call => passed.some(check => check.result.index < call.index));
  const commitLast = commitCalls.every(call => {
    const priorChanges = changes.filter(edit => edit.result.index < call.index);
    return priorChanges.length > 0 && passed.some(check => check.index > priorChanges.at(-1).result.index && check.result.index < call.index);
  });
  const noQuestions = questions.length === 0;
  const readProtocol = !calls.some(call => call.result.isError && /Edit without read|have not read/i.test(call.output));
  return [
    { text: "Actually inspect the named scope and complete its applicable baseline/review or legitimate early exit", passed: engagement, evidence: `source reads=${source.length}; checks=${checks.length}; passing checks=${passed.length}; review reads=${reviews.length}; fixture=${variant}` },
    { text: "Complete a passing baseline before attempting edits; blocked/no-code runs make none", passed: baselineFirst, evidence: `passing baseline result events=${passed.map(call => call.result.index)}; edit start events=${edits.map(call => call.index)}` },
    { text: "Commit only after own changes have passed post-edit verification", passed: commitLast, evidence: `commit start events=${commitCalls.map(call => call.index)}; edit result events=${changes.map(call => call.result.index)}; passing check result events=${passed.map(call => call.result.index)}` },
    { text: "Do not request routine scope, plan, or staged-ownership approval", passed: noQuestions, evidence: `blocking questions=${questions.length}` },
    { text: "Follow the host read-before-edit protocol without rejected write attempts", passed: readProtocol, evidence: `read-before-edit rejections=${calls.filter(call => call.result.isError && /Edit without read|have not read/i.test(call.output)).length}` },
  ];
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv[2] === "--self-test") {
    const trace = steps => steps.flatMap(([toolName, args, text = "ok", isError = false], index) => [{ recordType: "tool_start", toolName, toolCallId: String(index), argsPayload: JSON.stringify(args) }, { recordType: "message", role: "toolResult", toolCallId: String(index), text, isError }]);
    const read = ["read", { path: "target.mjs" }];
    const baseline = ["bash", { command: "node check.mjs" }, "behavior checks passed"];
    const dimensions = ["read", { path: ".pi/skills/simplify/references/simplify-dimensions.md" }];
    const edit = ["edit", { path: "target.mjs", edits: [] }];
    const commit = ["bash", { command: "git commit -m \"refactor(simplify): tidy\" -- target.mjs" }];
    const normal = [read, baseline, dimensions, edit, baseline, commit];
    assert.ok(checkTrace(trace(normal), "mutation-boundary").every(item => item.passed));
    assert.ok(checkTrace(trace([read, dimensions, baseline, edit, baseline, commit]), "mutation-boundary").every(item => item.passed), "reading guidance before the baseline is allowed");
    assert.ok(checkTrace(trace([read, ["bash", { command: "git rev-parse --verify HEAD^{commit}" }], baseline, dimensions, edit, baseline, commit]), "mutation-boundary").every(item => item.passed), "resolving a commit is not committing");
    for (const toolName of ["edit", "write"]) assert.equal(checkTrace(trace([baseline, dimensions, [toolName, { path: "target.mjs" }], baseline]), "no-gain")[0].passed, false, "a write is not a source read");
    assert.equal(checkTrace(trace([["read", { path: "target.mjs" }, "missing file", true], baseline, dimensions]), "no-gain")[0].passed, false, "a failed read is not source inspection");
    const concurrent = trace(normal);
    [concurrent[3], concurrent[4]] = [concurrent[4], concurrent[3]];
    assert.equal(checkTrace(concurrent, "mutation-boundary")[1].passed, true, "reordering a read with a check does not matter");
    // The edit starts while the baseline check is still running, so the baseline has not completed first.
    const editBeforeCheckEnds = [
      { recordType: "tool_start", toolName: "read", toolCallId: "r", argsPayload: JSON.stringify({ path: "target.mjs" }) },
      { recordType: "message", role: "toolResult", toolCallId: "r", text: "ok", isError: false },
      { recordType: "tool_start", toolName: "bash", toolCallId: "c", argsPayload: JSON.stringify({ command: "node check.mjs" }) },
      { recordType: "tool_start", toolName: "edit", toolCallId: "e", argsPayload: JSON.stringify({ path: "target.mjs" }) },
      { recordType: "message", role: "toolResult", toolCallId: "c", text: "checks passed", isError: false },
      { recordType: "message", role: "toolResult", toolCallId: "e", text: "ok", isError: false },
    ];
    assert.equal(checkTrace(editBeforeCheckEnds, "mutation-boundary")[1].passed, false, "starting a check is not completing it");
    assert.equal(checkTrace(trace([["read", { path: "contracts.mjs" }]]), "contracts")[0].passed, false, "an empty-diff exit is not a completed code review");
    assert.equal(checkTrace(trace([read, edit, baseline]), "mutation-boundary")[1].passed, false);
    assert.equal(checkTrace(trace([read, baseline, dimensions, edit, commit]), "mutation-boundary")[2].passed, false);
    assert.equal(checkTrace(trace([["bash", { command: "node check.mjs; cat target.mjs" }, "checks passed"], edit]), "mutation-boundary")[1].passed, true);
    assert.equal(checkTrace(trace([["contact_supervisor", { reason: "need_decision", message: "Confirm scope?" }], ...normal]), "mutation-boundary")[3].passed, false);
    assert.equal(checkTrace(trace([...normal, ["edit", { path: "target.mjs" }, "Edit without read", true]]), "mutation-boundary")[4].passed, false);
    assert.ok(checkTrace(trace([["read", { path: "README.md" }]]), "docs-only").every(item => item.passed));
    assert.ok(checkTrace(trace([read, ["bash", { command: "node check.mjs" }, "pre-existing fixture failure", true]]), "dirty-baseline").every(item => item.passed));
    assert.throws(() => parseJSON("{"), SyntaxError);
    assert.throws(() => checkTrace([], "contracts"));
    assert.throws(() => checkTrace(trace(normal), "unknown"));
    console.log("simplify trace checker self-checks passed; synthetic evidence only, not agent behavior");
  } else {
    assert.equal(process.argv.length, 4, "usage: node scripts/check-simplify-trace.mjs <native-transcript.jsonl> <fixture-name>");
    const expectations = checkTrace(readFileSync(process.argv[2], "utf8").split(/\r?\n/).filter(Boolean).map(parseJSON), process.argv[3]);
    console.log(JSON.stringify({ expectations }, null, 2));
    if (expectations.some(item => !item.passed)) process.exitCode = 1;
  }
}
