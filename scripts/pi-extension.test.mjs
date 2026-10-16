import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import extension from "../extensions/index.ts";

const skill = (name, path = `../skills/${name}/SKILL.md`) => ({
  name: `skill:${name}`,
  description: `${name} description`,
  source: "skill",
  sourceInfo: { path: fileURLToPath(new URL(path, import.meta.url)) },
});
const allSkills = readdirSync(new URL("../skills/", import.meta.url)).map((name) => skill(name));

function harness(commands = allSkills, context = {}) {
  const registered = new Map();
  const sent = [];
  const messages = [];
  const notices = [];
  const reports = [];
  const events = new Map();
  let discoveries = 0;
  const ctx = { mode: "tui", hasUI: true, isIdle: () => true, ui: { notify: (...args) => { notices.push(args); reports.push(args[0]); } }, ...context };
  extension({
    on: (name, handler) => events.set(name, handler),
    registerCommand: (name, command) => registered.set(name, command),
    getCommands: () => { discoveries++; return commands; },
    sendUserMessage: (...args) => sent.push(args),
    sendMessage: (...args) => { messages.push(args); reports.push(args[0].content); },
  });
  events.get("session_start")?.({}, ctx);
  const input = (text, source = "interactive") => events.get("input")({ text, source }, ctx);
  return { registered, sent, messages, notices, reports, ctx, commands, input, discoveries: () => discoveries, run: (args = "") => registered.has("coding") ? registered.get("coding").handler(args, ctx) : input(`/coding${args ? ` ${args}` : ""}`) };
}

const h = harness();
assert.deepEqual([...h.registered.keys()], ["coding"], "only the namespaced command is registered");
assert.equal(h.discoveries(), 0, "factory must not inspect session resources before they load");
assert.deepEqual(h.sent, [], "loading an extension must not start a workflow");
await h.run();
assert.equal(h.reports.length, 1);
assert.match(h.reports[0], /\/coding <skill>/);
for (const command of allSkills) assert.ok(h.reports[0].includes(command.name.slice(6)));
assert.deepEqual(h.messages, [], "interactive help uses the host UI, not another model turn");
assert.deepEqual(h.sent, []);

for (const [input, expected] of [
  ["plan", "/skill:plan"],
  ["plan inspect a feature", "/skill:plan inspect a feature"],
  ['  plan   "path with spaces"  \nsecond line\n', '/skill:plan   "path with spaces"  \nsecond line\n'],
  ["plan\nline one\nline two", "/skill:plan line one\nline two"],
  ["plan ", "/skill:plan "],
]) {
  const run = harness();
  await run.run(input);
  assert.deepEqual(run.sent, [[expected, { expandPromptTemplates: true }]], `native expansion and payload: ${JSON.stringify(input)}`);
  assert.deepEqual(run.messages, []);
}

for (const input of ["unknown", "../plan", "plan/../../other", "/skill:plan", "plan;echo", "Plan"]) {
  const run = harness();
  await run.run(input);
  assert.deepEqual(run.sent, [], `invalid selector must not dispatch: ${input}`);
  assert.match(run.reports[0], /unavailable/i);
}
for (const commands of [
  [],
  [skill("plan", "../README.md")],
  [{ ...skill("plan"), source: "prompt" }],
  [skill("plan", "../skills/plan/missing.md")],
  [skill("plan"), skill("plan", "../README.md")],
  [skill("plan"), { ...skill("plan"), source: "extension" }],
  [skill("plan"), { ...skill("plan"), source: "prompt" }],
  [skill("../plan", "../skills/plan/SKILL.md")],
]) {
  const run = harness(commands);
  await run.run("plan do not bypass a disabled or conflicting resource");
  assert.deepEqual(run.sent, [], "only an unambiguous loaded package skill may run");
  assert.match(run.reports[0], /unavailable/i);
}

const filtered = harness([skill("plan")]);
await filtered.run();
assert.ok(filtered.reports[0].includes("plan description"));
assert.ok(!filtered.reports[0].includes("execute description"));
filtered.commands.length = 0;
await filtered.run("plan");
assert.deepEqual(filtered.sent, [], "availability must be read at invocation time, not cached");

const busy = harness(allSkills, { isIdle: () => false });
await busy.run("plan");
assert.match(busy.reports[0], /busy/i);
assert.deepEqual(busy.sent, [], "busy launches must neither steer nor queue another workflow");
await busy.run(" \t\n");
assert.match(busy.reports[1], /\/coding <skill>/, "help remains available while busy");

for (const mode of ["tui", "rpc"]) {
  const run = harness(allSkills, { mode, hasUI: true });
  await run.run();
  await run.run("unknown");
  assert.equal(run.notices.length, 2);
  assert.equal(run.notices[1][1], "warning");
  assert.deepEqual(run.messages, []);
  assert.deepEqual(run.sent, []);
}
for (const mode of ["print", "json"]) {
  const run = harness(allSkills, { mode, hasUI: false });
  assert.deepEqual([...run.registered.keys()], [], "non-interactive requests must use the awaited native input pipeline");
  assert.deepEqual(await run.run('plan   "path with spaces"\nsecond line'), { action: "transform", text: '/skill:plan   "path with spaces"\nsecond line' });
  assert.deepEqual(run.sent, [], "CLI dispatch must not fork a fire-and-forget model turn");
  assert.deepEqual(await run.input("ordinary prompt"), { action: "continue" });
  assert.deepEqual(await run.input("/coding-other plan"), { action: "continue" });
  assert.deepEqual(await run.input("/coding plan", "extension"), { action: "continue" }, "extension messages retain native expansion policy");
  run.ctx.isIdle = () => false;
  if (mode === "json") {
    assert.deepEqual(await run.run("plan"), { action: "handled" });
    assert.match(run.reports[0], /busy/i);
    assert.deepEqual(await run.run(), { action: "handled" });
    assert.equal(run.messages[1][1].triggerTurn, false);
    assert.equal(run.messages[1][0].display, true);
    assert.deepEqual(await run.run("unknown"), { action: "handled" });
  }
}
const print = harness(allSkills, { mode: "print", hasUI: false });
const stderr = [];
const originalWrite = process.stderr.write;
try {
  process.stderr.write = (chunk) => { stderr.push(String(chunk)); return true; };
  await print.run();
  await print.run("unknown");
} finally {
  process.stderr.write = originalWrite;
}
assert.match(stderr[0], /\/coding <skill>/);
assert.match(stderr[1], /unavailable/i);
assert.deepEqual(print.sent, []);
assert.deepEqual(print.messages, [], "print diagnostics must not rely on an invisible custom transcript message");
assert.deepEqual([...harness().registered.keys()], ["coding"], "a fresh reload registers one command without retained state");
console.log("pi extension checks passed: registration, native expansion, payloads, resource ownership/conflicts, filtering, busy handling, TUI/RPC/JSON/print reporting");
