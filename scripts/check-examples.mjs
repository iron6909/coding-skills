import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runInNewContext } from "node:vm";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const blocks = (path, language) => [...read(path).matchAll(new RegExp("```" + language + "\\r?\\n([\\s\\S]*?)\\r?\\n```", "g"))].map((match) => match[1]);

let manifest;
try {
  manifest = JSON.parse(read("package.json"));
} catch (error) {
  assert.fail(`Invalid package manifest: ${error.message}`);
}
assert.ok(manifest.keywords.includes("pi-package"), "the package must be discoverable as a Pi package");
assert.deepEqual(manifest.pi.skills, ["./skills"], "Pi must load the existing self-contained skill directories");
assert.deepEqual(manifest.pi.extensions, ["./extensions/index.ts"], "Pi must load the single command adapter");
assert.equal(manifest.type, "module");
assert.deepEqual(manifest.peerDependencies, { "@earendil-works/pi-coding-agent": "*" }, "Pi provides the host, not a bundled runtime dependency");
assert.ok(!manifest.dependencies, "the adapter must not add runtime packages");
assert.deepEqual(manifest.files, ["extensions", "skills", "README.md", "LICENSE"], "publish resources and user-facing documents, not development rules");

// ponytail: these assert written contracts, not agent behavior; use workflow cases and real traces to evaluate compliance.
const lenses = read("skills/code-review/references/review-lenses.md");
assert.ok(lenses.includes("## Correctness and safety floor (always)"), "every review needs a correctness/safety floor");
for (const check of ["boundary conditions", "error handling", "test effectiveness", "trust boundaries", "data loss"]) {
  assert.ok(lenses.includes(check), `missing review floor: ${check}`);
}
assert.ok(lenses.includes("explicit user request for this run"), "a requested specialist lens must not require a config file");
for (const [skill, action] of [["optimize", "## Process"], ["simplify", "## Execution"], ["ui-review", "1. Resolve any open design decision"]]) {
  const source = read(`skills/${skill}/SKILL.md`);
  const gate = source.indexOf("## Workspace safety");
  assert.ok(gate >= 0 && gate < source.indexOf(action), `${skill} needs workspace safety before its first affected action`);
  for (const safeguard of ["initial staged and unstaged", "default branch", "sign-off"]) {
    assert.ok(source.includes(safeguard), `${skill} missing safeguard: ${safeguard}`);
  }
}

const guide = read("skills/guide/SKILL.md");
assert.ok(guide.includes("not installed") && guide.includes("directly handle"), "guide must offer installation or direct execution when its target is absent");
const readme = read("README.md");
const [coreSkills, auxiliarySkills] = ["核心技能", "辅助技能"].map((label) => {
  const section = readme.split(`### ${label}`)[1]?.split("\n#")[0] ?? "";
  return [...section.matchAll(/\]\(skills\/([\w-]+)\/SKILL\.md\)/g)].map(([, name]) => name);
});
assert.deepEqual(coreSkills, ["survey", "clarify", "plan", "execute", "code-review"], "the core must contain exactly the five main-workflow skills");
const installedSkills = readdirSync(new URL("../skills/", import.meta.url), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
assert.deepEqual([...coreSkills, ...auxiliarySkills].sort(), installedSkills, "every skill must be classified once as core or auxiliary");
for (const skill of installedSkills) {
  const source = read(`skills/${skill}/SKILL.md`);
  assert.match(source, new RegExp(`^name: ${skill}$`, "m"), `${skill} must retain its portable name`);
  assert.match(source, /^disable-model-invocation: true$/m, `${skill} must remain explicitly invoked`);
}
assert.ok(readme.split("## 快速开始")[1]?.split("\n## ")[0].includes("/clarify"), "the quick start must work without optional guide");
for (const file of readdirSync(new URL("../skills/", import.meta.url), { recursive: true }).filter((file) => file.endsWith(".md"))) {
  const source = read(`skills/${file}`);
  assert.ok(!/\bgitignored\b/i.test(source), `${file} must not assume the user's ignore policy`);
}
for (const skill of ["clarify", "plan", "execute", "autoflow"]) {
  assert.ok(!/another specification system|OpenSpec|Spec Kit|Specify/.test(read(`skills/${skill}/SKILL.md`)), `${skill} must not advertise external specification compatibility`);
}
for (const skill of ["code-review", "ui-review"]) {
  assert.ok(read(`skills/${skill}/SKILL.md`).includes("approved `ui-spec.md`"), `${skill} must check applicable approved UI decisions`);
}
for (const config of ["review-lenses.toml", "review-lenses.md"]) assert.ok(readme.includes(config), `README must document ${config}`);

const strategy = read("skills/execute/references/testing-strategy.md");
assert.ok(!/Recommended ratio|Coverage targets|Dependencies can be mocked/.test(strategy), "test selection must follow risk, not universal quotas or mockability");
assert.ok(!read("skills/ideate/SKILL.md").includes("Generate 5-8"), "ideation must not pad the option count");
for (const file of ["component-states.md", "wcag-checklist.md"]) {
  assert.ok(read(`skills/ui-design/references/${file}`).includes("## Contents"), `${file} needs navigation before detailed examples`);
}
let workflowCases;
try {
  workflowCases = JSON.parse(read("scripts/workflow-cases.json"));
} catch (error) {
  assert.fail(`Invalid workflow cases: ${error.message}`);
}
assert.ok(Array.isArray(workflowCases) && workflowCases.length > 0, "the manual workflow case set must be a non-empty array");
assert.equal(new Set(workflowCases.map(({ id }) => id)).size, workflowCases.length, "workflow case IDs must be unique");
for (const item of workflowCases) {
  assert.match(item.id, /^[a-z][a-z0-9-]+$/);
  assert.match(item.skill, /^[a-z][a-z-]+$/);
  assert.ok(read(`skills/${item.skill}/SKILL.md`), `unknown workflow skill: ${item.skill}`);
  for (const key of ["setup", "prompt"]) assert.ok(typeof item[key] === "string" && item[key].trim(), `${item.id}: missing ${key}`);
  for (const key of ["expect", "forbid"]) assert.ok(Array.isArray(item[key]) && item[key].length > 0 && item[key].every((value) => typeof value === "string" && value.trim()), `${item.id}: missing ${key}`);
}

const loginExamples = blocks("skills/execute/references/testing-strategy.md", "javascript").filter((source) => source.includes("app.post('/api/login'"));
assert.equal(loginExamples.length, 1);
for (const source of loginExamples) {
  for (const [body, status] of [
    [{ email: "user@example.com", password: "wrong" }, 401],
    [{ email: "user@example.com", password: "correct" }, 200],
    [{ email: "missing@example.com", password: "correct" }, 401],
    [{ email: [], password: "correct" }, 400],
    [{ email: "user@example.com", password: {} }, 400],
    [undefined, 400],
  ]) {
    let handler;
    let signed = 0;
    runInNewContext(source, {
      app: { post: (_path, fn) => { handler = fn; } },
      db: { findUser: (email) => email === "user@example.com" ? { id: 7, passwordHash: "test-only" } : null },
      bcrypt: { compare: async (password) => password === "correct" },
      jwt: { sign: ({ userId }) => { assert.equal(userId, 7); signed++; return "test-token"; } },
      SECRET: "test-only",
    }, { timeout: 1000 });
    const res = { code: 200, status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } };
    await handler({ body }, res);
    assert.equal(res.code, status, `login response for ${JSON.stringify(body)}`);
    assert.equal(signed, status === 200 ? 1 : 0);
    assert.equal(res.body.token, status === 200 ? "test-token" : undefined);
  }
}

const cleanupExample = blocks("skills/execute/references/testing-strategy.md", "javascript").find((source) => source.includes("beforeEach("));
assert.ok(cleanupExample, "missing test-isolation example");
let cleanupHook, finishDatabaseCleanup;
const cleanupEvents = [];
const databaseCleanup = new Promise((resolve) => { finishDatabaseCleanup = resolve; });
runInNewContext(cleanupExample, {
  beforeEach: (hook) => { cleanupHook = hook; },
  db: { users: { deleteAll: () => databaseCleanup.then(() => cleanupEvents.push("database")) } },
  jest: { clearAllMocks: () => cleanupEvents.push("mocks") },
  app: { reset: () => cleanupEvents.push("application") },
}, { timeout: 1000 });
const cleaning = cleanupHook();
assert.equal(typeof cleaning?.then, "function", "the test hook must return its cleanup promise");
assert.deepEqual(cleanupEvents, [], "test setup must wait for database cleanup");
finishDatabaseCleanup();
await cleaning;
assert.deepEqual(cleanupEvents, ["database", "mocks", "application"]);
assert.ok(cleanupExample.includes("await app.reset()"), "asynchronous application reset must also finish before tests");

// ponytail: check this JSX example's label branches without React; use a DOM accessibility check if its naming becomes structural.
const loadingButton = blocks("skills/ui-review/references/common-ui-mistakes.md", "jsx").find((source) => source.includes("disabled={isLoading}"));
assert.ok(loadingButton?.includes('<span aria-hidden="true"><Spinner /></span>'), "the loading spinner must be decorative");
const loadingLabel = loadingButton.match(/\{(isLoading \? '[^']+' : '[^']+')\}/)?.[1];
assert.ok(loadingLabel, "the loading button must retain a text label in both states");
for (const isLoading of [false, true]) {
  assert.ok(runInNewContext(loadingLabel, { isLoading }, { timeout: 1000 }).trim(), "button name must not disappear while loading");
}
assert.ok(!read("skills/code-review/references/lens-performance.md").includes("const len = items.length"), "array-length caching must not be a blanket optimization");

const algorithms = blocks("skills/code-review/references/lens-performance.md", "typescript").filter((source) => source.includes("function hasDuplicates"));
assert.equal(algorithms.length, 2);
const implementations = algorithms.map((source) => runInNewContext(source + "\nhasDuplicates", {}, { timeout: 1000 }));
const item = {};
for (const values of [[], [1], [1, 2], [1, 1, 1], [NaN, NaN], [0, -0], ["1", 1], [{}, {}], [item, item], new Array(2)]) {
  for (const fn of implementations) assert.equal(fn(values), new Set(values).size !== values.length);
}

const accessibility = read("skills/code-review/references/lens-accessibility.md");
assert.ok(accessibility.includes("dialog.showModal()"));
assert.ok(accessibility.includes('<form method="dialog">'));
assert.ok(!accessibility.includes("onkeydown=\"if(event.key==='Enter')"));
const security = read("skills/code-review/references/lens-security.md");
assert.ok(!security.includes("// ❌ XSS vulnerability\n<div>{user.bio}</div>"));
const execute = read("skills/execute/SKILL.md");
assert.ok(!/\bmodes?\b|5 task review-fix rounds/i.test(execute), "execute must not retain modes or the five-round review loop");
assert.ok(execute.includes("After each task is committed, continue directly to the next executable task"), "execute must continue between tasks");
assert.ok(execute.includes("git diff <task_base> -- <task-owned paths>"), "task reviews must include current staged and unstaged changes, not earlier tasks");
assert.ok(execute.includes("Task <N>: review fix pass —"), "the fix allowance must survive a resumed run");
const taskReview = execute.split("## Task review\n")[1].split("\n## ")[0];
for (const rule of ["Review inline by default", "one fix pass and one scoped re-check", "Do not restart the full task review", "Stop before committing or advancing"]) {
  assert.ok(taskReview.includes(rule), `missing task-review rule: ${rule}`);
}
assert.ok(execute.includes("Stop and ask the user for explicit sign-off on that specific risk"), "continuous execution must retain risk approval");
for (const file of ["skills/guide/SKILL.md", "skills/autoflow/SKILL.md", "README.md"]) {
  assert.ok(!/execute auto|Pass `auto`|传\s*`?auto`?|逐任务停下确认/.test(read(file)), `stale execute mode in ${file}`);
}
assert.ok(read("shared/references/definition-of-done.md").includes("full suite ran on the final completed change or standalone fix"), "full-suite timing must agree with continuous execution");
const taxExamples = blocks("skills/simplify/references/complexity-metrics.md", "python").filter((source) => source.includes("def calculate_tax("));
assert.equal(taxExamples.length, 2);
// ponytail: use a local Python interpreter; report a skip if absent. Install Python when this example coverage is required.
const python = spawnSync(process.platform === "win32" ? "python" : "python3", ["-c", `
import json, math, sys
implementations = []
for source in json.load(sys.stdin):
    namespace = {}
    exec(source, namespace)
    implementations.append(namespace["calculate_tax"])
for country in ["US", "UK", "DE", "FR", None, [], {}]:
    for amount in [0, 1, -100, 1e308, float("nan")]:
        before, after = [fn(country, amount) for fn in implementations]
        if before is None:
            assert after is None, (country, amount, before, after)
        elif math.isnan(before):
            assert math.isnan(after), (country, amount, before, after)
        else:
            assert before == after, (country, amount, before, after)
print("tax examples preserve behavior, including unknown and unhashable country values")
`], { input: JSON.stringify(taxExamples), encoding: "utf8", timeout: 10000 });
if (python.error?.code === "ENOENT") {
  console.log("SKIP: Python tax examples (Python interpreter unavailable)");
} else {
  if (python.error) throw python.error;
  assert.equal(python.status, 0, python.stderr);
  console.log(python.stdout.trim());
}

const reviewFile = "skills/code-review/SKILL.md";
const finish = read("skills/execute/references/finish.md");
const fixture = mkdtempSync(join(tmpdir(), "skill-git-examples-"));
const git = (...args) => execFileSync("git", ["-C", fixture, "-c", "user.name=Example checks", "-c", "user.email=checks@example.invalid", "-c", "commit.gpgsign=false", ...args], {
  encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 10000,
  env: { ...Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.toUpperCase().startsWith("GIT_"))), GIT_CONFIG_GLOBAL: join(fixture, "global-config"), GIT_CONFIG_NOSYSTEM: "1" },
});
try {
  writeFileSync(join(fixture, "global-config"), "");
  git("init", "--quiet", "--initial-branch=main");
  for (let n = 1; n <= 7; n++) {
    writeFileSync(join(fixture, "value"), `${n}\n`);
    git("add", "value");
    git("commit", "-qm", `initial ${n}`);
  }
  git("switch", "-qc", "feature/example-check");
  const reviewBase = git("rev-parse", "HEAD~5").trim();
  const reviewHead = git("rev-parse", "HEAD").trim();
  const commands = blocks(reviewFile, "bash").filter((source) => /^git (diff|log) /.test(source));
  for (const [, command] of read("skills/code-review/references/review-lenses.md").matchAll(/^Diff command: (git diff .+)$/gm)) commands.push(command);
  const ranges = commands.map((source) => {
    const args = source.trim().replaceAll("<review-base>", "HEAD~5").replaceAll("<review_base_sha>", reviewBase).replaceAll("<review_head_sha>", reviewHead).split(/\s+/).slice(1);
    return [args, git(...args)];
  });
  assert.equal(ranges.length, 5, "check the main review commands and all three dispatch templates");
  for (let n = 8; n <= 10; n++) {
    writeFileSync(join(fixture, "value"), `${n}\n`);
    git("add", "value");
    git("commit", "-qm", `fix ${n}`);
  }
  assert.notEqual(git("rev-parse", "HEAD~5").trim(), reviewBase);
  for (const [args, expected] of ranges) assert.equal(git(...args), expected, "the documented review range moved after fix commits");
  git("switch", "-q", "main");
  assert.throws(() => git("branch", "-d", "feature/example-check"));
  const discard = finish.match(/git branch -D <work-branch>/)?.[0];
  assert.ok(discard, "confirmed discard needs a narrow exception for an unmerged branch");
  git(...discard.replace("<work-branch>", "feature/example-check").split(/\s+/).slice(1));
  assert.equal(git("branch", "--list", "feature/example-check").trim(), "");
} finally {
  rmSync(fixture, { recursive: true, force: true });
}

let state;
try {
  state = JSON.parse(blocks("skills/autoflow/references/state-management.md", "json")[0]);
} catch (error) {
  assert.fail(`Invalid autoflow state example: ${error.message}`);
}
assert.equal(state.version, 2, "the expanded approval snapshot needs a distinct schema version");
for (const input of ["spec", "plan", "ui_spec", "design"]) {
  assert.ok(Object.hasOwn(state, input), `missing approved input path: ${input}`);
  assert.ok(Object.hasOwn(state.approval, `${input}_blob`), `missing approved input snapshot: ${input}`);
}
assert.ok(read("skills/autoflow/references/state-management.md").includes("added, removed, or changed"), "recovery must detect presence changes as well as modified contents");
for (const lens of ["accessibility", "i18n", "performance"]) {
  const source = read(`skills/code-review/references/lens-${lens}.md`);
  assert.ok(source.includes("Severity (blocking, important, minor)"), `${lens} must permit the full severity range`);
}
assert.ok(accessibility.includes("14pt bold"), "large bold text has a separate WCAG threshold");
assert.ok(!security.includes("// ✅ Validated and sanitized"), "extension and metadata size checks alone do not validate uploads");
for (const rule of ["decode", "server-generated", "exclusive", "outside"]) assert.ok(security.includes(rule), `missing upload safeguard: ${rule}`);
const debug = read("skills/debug/SKILL.md");
const workspaceGate = debug.indexOf("## Workspace safety");
assert.ok(workspaceGate >= 0 && workspaceGate < debug.indexOf("## Phase 1:"), "workspace safety must precede probes and hypothesis edits");
assert.ok(debug.includes("initial staged and unstaged"), "debug must preserve pre-existing work before probing");
assert.ok(finish.includes("typed `discard`"), "force deletion must retain explicit discard confirmation");
const ideate = read("skills/ideate/SKILL.md");
assert.ok(ideate.includes("numeric suffix"), "ideation reports must not overwrite collisions");
assert.ok(!ideate.includes("that's Phase 2"), "ideation must not promise prototypes in Phase 2");
assert.ok(!read("skills/refactor/SKILL.md").includes("Never write a refactor report into the repository"), "temporary report writes are allowed; commits are not");
assert.ok(!read("shared/references/counterfactual-test.md").includes("barely passes"), "generic security advice fails the counterfactual gate");
const metrics = read("skills/simplify/references/complexity-metrics.md");
assert.ok(!/Mandatory split|must split|must flatten/.test(metrics), "metrics must not force mechanical splitting");
// ponytail: sum annotated increments, not a full metric implementation; use the project's analyzer to validate language-specific scoring rules.
const cognitiveExample = blocks("skills/simplify/references/complexity-metrics.md", "python").find((source) => source.includes("def calculate_discount("));
assert.ok(cognitiveExample, "missing cognitive-complexity example");
const increments = [...cognitiveExample.matchAll(/# (\+[^\n]+)/g)].map(([, annotation]) => Number(annotation.match(/= \+(\d+)/)?.[1] ?? annotation.match(/^\+(\d+)/)[1]));
assert.equal(increments.reduce((sum, value) => sum + value, 0), Number(cognitiveExample.match(/Total cognitive complexity: (\d+)/)[1]), "complexity annotations must add up to the stated total");
assert.ok(!read("skills/simplify/SKILL.md").includes("Blocking findings should not exist here"), "passing tests must not suppress Blocking findings");
assert.ok(!read("skills/doc-review/references/review-lenses.md").includes("mark as Important"), "missing evidence must be graded by impact");
const decomposition = read("skills/plan/references/task-decomposition.md");
assert.ok(!decomposition.includes("May not be testable independently"), "every task must remain independently testable");
assert.ok(!decomposition.includes('"Add password reset flow" (expands auth system horizontally)'), "password reset is a new vertical journey");
assert.ok(!read("README.md").includes("1. 上传 API endpoint"), "the README must start with a vertical slice, not isolated layers");

const dod = read("shared/references/definition-of-done.md");
for (const rule of ["## Unavailable required checks", "partial/blocked", "not a waiver", "Intermediate task commits", "read-only report"]) {
  assert.ok(dod.includes(rule), `missing completion-gate contract: ${rule}`);
}
for (const skill of ["execute", "debug"]) {
  assert.ok(read(`skills/${skill}/SKILL.md`).includes("Unavailable required checks"), `${skill} must use the shared unavailable-check gate`);
}
assert.ok(read("skills/autoflow/SKILL.md").includes("unavailable required verification"), "autoflow must not advance past missing required verification");
const tdd = read("shared/references/tdd.md");
assert.ok(tdd.includes("Do not repeat a trustworthy RED/GREEN cycle"), "unchanged deterministic tests must reuse observed proof");
assert.ok(tdd.includes("test or fixture changed") && tdd.includes("failure cause was unclear"), "uncertain proof still needs a fresh guard check");
assert.ok(read("skills/plan/SKILL.md").includes("Run-only verification belongs in Final verification"), "verification commands alone must not create a task");
const simplify = read("skills/simplify/SKILL.md");
const baselineGate = simplify.indexOf("### 2. Check the baseline");
assert.ok(baselineGate > simplify.indexOf("### 1. Determine scope"));
for (const ref of ["simplify-dimensions.md", "severity.md", "git-commit.md"]) {
  assert.ok(simplify.indexOf(ref) > baselineGate, `simplify must delay ${ref} until after the baseline gate`);
}
assert.match(read("skills/code-review/SKILL.md"), /When active learning files exist, read `\.\/references\/learnings-format\.md`/, "absent learnings must not load their format");
assert.match(read("skills/plan/SKILL.md"), /If active learning files exist, read `\.\/references\/learnings-format\.md`/, "plan must also load learning format conditionally");
assert.ok(read("skills/capture/SKILL.md").includes("without loading writing or commit references"), "zero-entry capture must stop before write-stage references");
assert.ok(!guide.includes("a missing core skill is an incomplete installation"), "an absent route target must not diagnose core completeness");
assert.ok(finish.includes("Keep is the only permitted outcome"), "keep-only authorization must not require another choice");
assert.ok(finish.indexOf("Keep is the only permitted outcome") > finish.indexOf("## Entry gate"), "default keep must not bypass verification");
assert.ok(read("skills/handoff/SKILL.md").includes("Do not infer a skill stage"), "handoff must not invent a phase from the topic");
console.log("example and contract checks passed: login, async cleanup, loading labels, duplicates, complexity totals, accessibility, continuous execution, bounded task review, pinned review and dispatch ranges, confirmed discard and document contracts");
console.log(`Validated ${workflowCases.length} manual workflow cases; no agent runs or behavioral pass claims.`);
