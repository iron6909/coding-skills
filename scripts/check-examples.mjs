import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runInNewContext } from "node:vm";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8").replace(/\r\n/g, "\n");
const blocks = (path, language) => [...read(path).matchAll(new RegExp(`\`\`\`${language}\\r?\\n([\\s\\S]*?)\\r?\\n\`\`\``, "g"))].map((match) => match[1]);

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
const review = read("skills/code-review/SKILL.md");
const reviewer = read("skills/code-review/references/code-reviewer.md");
assert.doesNotMatch(review + reviewer, /review-lenses|legacy configuration|backward compatibility with/i, "the review contract must describe current behavior, not version compatibility");
for (const check of ["boundary conditions", "error handling", "Test effectiveness", "trust boundaries", "data loss"]) {
  assert.ok(reviewer.includes(check), `missing comprehensive review check: ${check}`);
}
for (const rule of ["one fresh read-only subagent", "never the whole session history", "inline self-review (no independent reviewer)", "A failed delegation is a blocker", "Rule explicitly on every item", "Explain rejected findings with technical evidence", "stricter readiness gate"]) {
  assert.ok(review.includes(rule), `missing review coordination rule: ${rule}`);
}
for (const rule of ["Do not write review reports or persist findings", "Review alone does not authorize code changes", "preserve user hunks", "one scoped re-check", "automatic second fix wave"]) {
  assert.ok(review.includes(rule), `missing review boundary: ${rule}`);
}
for (const rule of ["Diff command: <pinned_diff_command>", "Do not dispatch a second reviewer", "author\'s rationale never grades its own correctness", "### Declined to judge", "**Ready**, **Needs fixes**, or **Unverified**"]) {
  assert.ok(reviewer.includes(rule), `missing reviewer contract: ${rule}`);
}
const reviewReferences = readdirSync(new URL("../skills/code-review/references/", import.meta.url));
assert.deepEqual(reviewReferences.filter((file) => /^(lens-|review-lenses\.|subagent-dispatch\.)/.test(file)), [], "retired lens and axis-dispatch references must not ship");
const repositoryChanges = read("shared/references/repository-changes.md");
for (const safeguard of ["initial staged and unstaged", "relevant untracked content", "default branch", "specific sign-off", "<REDACTED>", "non-document scratch", "Preserve every document", "ignore and tracking policy", "Do not push, merge", "do not authorize edits", "unrun checks remain unverified"]) {
  assert.ok(repositoryChanges.includes(safeguard), `shared repository changes missing safeguard: ${safeguard}`);
}
assert.ok(repositoryChanges.includes("Document and work-record writes count too") && repositoryChanges.includes("do not add an application test workflow"), "shared safety covers document writes without inventing an implementation workflow");
for (const [skill, action] of [["optimize", "## Process"], ["simplify", "## Execution"], ["ui-review", "## Phase 0:"]]) {
  const source = read(`skills/${skill}/SKILL.md`);
  const gate = source.indexOf("./references/repository-changes.md");
  assert.ok(gate >= 0 && gate < source.indexOf(action), `${skill} must load shared safety before its first affected action`);
}

const spike = read("skills/spike/SKILL.md");
const designInput = read("shared/references/design-input.md");
assert.doesNotMatch(designInput, /initial staged and unstaged|default branch/, "design preservation must not duplicate shared workspace safety");
assert.ok(spike.includes("non-document scratch"), "spike must preserve reproducible evidence before cleaning scratch");
assert.ok(spike.includes("./references/repository-changes.md"), "spike must load shared repository safety before experiments");
assert.ok(spike.indexOf("## Safety before experiments") < spike.indexOf("## Gather evidence"), "spike safety must precede execution");
for (const rule of ["Do not require an approved spec or plan", "Supported", "Not supported", "Inconclusive", "Do not mock the dimension being tested", "preserve previous methods, failures, and conclusions"]) {
  assert.ok(spike.includes(rule), `missing independent spike contract: ${rule}`);
}
for (const rule of ["untrusted input", "section by section", "schemas and constraints", "same directory", "original material became unavailable", "not need the original source, proposal, spike report, or conversation"]) {
  assert.ok(designInput.includes(rule), `missing design preservation contract: ${rule}`);
}
assert.ok(spike.includes("Accept a candidate, its blocking design question, constraints, and a deciding criterion") && spike.includes("A prior `ideate` invocation is not required"), "spike needs a bounded design question, not prior workflow history");
assert.ok(spike.includes("Do not take downstream work as a probe request") && spike.includes("with their existing workflow"), "spike must not absorb routine downstream verification or invent a design detour");
assert.ok(spike.includes("routine inspection unrelated to a candidate-design decision") && spike.includes("design premise discovered during downstream work"), "spike exclusions must not reject bounded design questions or source-based evidence");
assert.ok(spike.includes("candidate, question, or dependent design decision cannot be established") && spike.includes("ask here for missing constraints or a deciding criterion"), "spike must distinguish an unframed question from missing details it can clarify locally");
assert.ok(!spike.includes("If an intended design probe lacks the required inputs"), "missing details alone must not force an ideate detour");
assert.ok(spike.includes("effort boundary>") && spike.includes("why the run stopped"), "spike evidence must preserve its effort boundary and stopping reason");
assert.ok(spike.includes("another session can reconstruct the probe and inputs from the report and its appendices alone") && spike.includes("complete runnable probe and exact inputs or a deterministic fixture generator"), "scratch cleanup requires self-contained reproduction, not just selected snippets");
assert.ok(spike.split("## Finish")[1].includes("Recommend `ideate` for every outcome"), "even supported evidence must return to design rather than approve delivery");
assert.ok(spike.includes("Do not edit `proposal.md`") && spike.includes("Commit only the report and its necessary internal appendices"), "spike owns evidence, not proposals or contracts");
assert.ok(designInput.includes("It does not own `proposal.md` or import a complete external design") && designInput.includes("recommend `ideate` and stop before experiments"), "full external design imports belong to design-document owners, not spike");
assert.ok(designInput.includes("For `spike`, read only material needed to frame, interpret, or reproduce the bounded design evidence") && designInput.includes("The following full-design preservation and import checks apply to `ideate` and `spec`, not `spike`"), "shared input rules must scope spike reading separately from full design imports");

const guide = read("skills/guide/SKILL.md");
assert.ok(guide.includes("not installed") && guide.includes("directly handle"), "guide must offer installation or direct execution when its target is absent");
const routing = guide.split("## Routing order")[1].split("## Handoff")[0];
assert.ok(routing.includes("missing constraints or a deciding criterion can be clarified there") && !routing.includes("lacks the inputs for a bounded design probe"), "guide must not divert a framed spike question solely because a constraint or criterion is missing");
assert.ok(routing.indexOf("small change with clear scope and acceptance checks") >= 0 && routing.indexOf("small change with clear scope and acceptance checks") < routing.indexOf("use `survey`"), "clear small work must route before workspace documentation");
assert.ok(routing.includes("Missing `AGENTS.md` alone does not require a survey"), "missing instructions must not force document creation");
const readme = read("README.md");
const [coreSkills, auxiliarySkills] = ["核心技能", "辅助技能"].map((label) => {
  const section = readme.split(`### ${label}`)[1]?.split("\n#")[0] ?? "";
  return [...section.matchAll(/\]\(skills\/([\w-]+)\/SKILL\.md\)/g)].map(([, name]) => name);
});
assert.deepEqual(coreSkills, ["survey", "spike", "spec", "plan", "execute", "code-review"], "README must identify the six core skills, including optional feasibility validation");
const installedSkills = readdirSync(new URL("../skills/", import.meta.url), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
assert.deepEqual([...coreSkills, ...auxiliarySkills].sort(), installedSkills, "every skill must be classified once as core or auxiliary");
for (const skill of installedSkills) {
  const source = read(`skills/${skill}/SKILL.md`);
  assert.match(source, new RegExp(`^name: ${skill}$`, "m"), `${skill} must retain its portable name`);
  assert.match(source, /^disable-model-invocation: true$/m, `${skill} must remain explicitly invoked`);
  if (skill !== "guide") {
    assert.ok(source.includes("./references/repository-changes.md"), `${skill} can write repository files or Git state and must load shared safety and delivery`);
    assert.equal(read(`skills/${skill}/references/repository-changes.md`).split("\n\n").slice(1).join("\n\n"), repositoryChanges, `${skill} must carry its self-contained copy`);
  }
}
for (const skill of ["execute", "debug", "code-review", "simplify", "optimize", "ui-review", "commit"]) {
  const source = read(`skills/${skill}/SKILL.md`);
  for (const reference of ["definition-of-done.md", "git-commit.md"]) {
    assert.ok(source.includes(`./references/${reference}`), `${skill} must use shared code-change verification and commit gates`);
  }
}
assert.ok(readme.split("## 快速开始")[1]?.split("\n## ")[0].includes("/coding spec"), "the quick start must work without optional guide");
for (const file of readdirSync(new URL("../skills/", import.meta.url), { recursive: true }).filter((file) => file.endsWith(".md"))) {
  const source = read(`skills/${file}`);
  assert.ok(!/\bgitignored\b/i.test(source), `${file} must not assume the user's ignore policy`);
}
assert.ok(!installedSkills.includes("clarify"), "the retired entry must not remain as a second implementation or alias");
for (const skill of ["spec", "plan", "execute", "autoflow"]) {
  assert.ok(!/another specification system|OpenSpec|Spec Kit|Specify/.test(read(`skills/${skill}/SKILL.md`)), `${skill} must not advertise external specification compatibility`);
}
for (const skill of ["code-review", "ui-review"]) {
  assert.ok(read(`skills/${skill}/SKILL.md`).includes("approved `ui-spec.md`"), `${skill} must check applicable approved UI decisions`);
}
assert.ok(readme.includes("审查重点通过本次请求或计划的 Review focus 提供"), "README must describe the current review inputs");
assert.ok(readme.includes("`code-review` 只在会话内交付结果，`ui-review` 仍保存报告"), "code-review output changes must not remove UI review reports");

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

const endpointExamples = blocks("skills/execute/references/testing-strategy.md", "javascript").filter((source) => source.includes(".post('/api/login')"));
assert.equal(endpointExamples.length, 1, "keep one public-interface test example");
for (const check of ["toBe(200)", "toBe(401)", "toBeUndefined()"]) assert.ok(endpointExamples[0].includes(check), `missing endpoint assertion: ${check}`);
assert.ok(!strategy.includes("app.post("), "test strategy should not carry a production endpoint implementation");

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
const execute = read("skills/execute/SKILL.md");
assert.ok(!/\bmodes?\b|5 task review-fix rounds/i.test(execute), "execute must not retain modes or the five-round review loop");
assert.ok(execute.includes("After each task is committed, continue directly to the next executable task"), "execute must continue between tasks");
assert.ok(execute.includes("git diff <task_base> -- <task-owned paths>") && execute.includes("only a candidate diff"), "the task-base diff is a candidate, not an ownership filter");
for (const rule of ["captured task-start contents", "isolated task increment", "Task <N>: starting state —", "never copy secrets into records"]) assert.ok(execute.includes(rule), `missing change-boundary rule: ${rule}`);
assert.ok(execute.includes("Task <N>: review fix pass —") && execute.includes("Task <N>: failed attempt —"), "review progress and failed attempts must survive a resumed persisted plan");
assert.ok(execute.includes("Small changes and session plans need no feature or task base SHAs, task briefs, pre-flight rows, or ledger events"), "small work must skip bookkeeping, not move it into conversation");
assert.ok(execute.includes("any failed-attempt count") && execute.includes("do not assume zero"), "lightweight recovery must retain or ask for the failure count");
assert.ok(execute.includes("**Persisted plan:**") && !execute.includes("**Planned work:**"), "name the persistence distinction explicitly");
assert.ok(execute.includes("supplied directly by the user") && execute.includes("without a spec"), "session plans must state whether directly supplied plans need a spec");
const exceptions = execute.split("## Exceptions and handoffs\n")[1]?.split("\n## ")[0] ?? "";
for (const rule of ["already satisfied", "no new commit", "empty commit", "Existing coverage", "`plan`", "`spec`", "`ideate`"]) assert.ok(exceptions.includes(rule), `missing exception route: ${rule}`);
const taskReview = execute.split("## Task review\n")[1].split("\n## ")[0];
for (const rule of ["Review inline by default", "scoped re-check", "A second clear in-scope correction does not need new approval", "Stop before committing or advancing"]) {
  assert.ok(taskReview.includes(rule), `missing task-review rule: ${rule}`);
}
assert.ok(!taskReview.includes("at most one fix pass"), "review pass count alone must not force another approval");
assert.ok(execute.includes("3 failed implementation or review-fix attempts") && execute.includes("do not reset the count on resume"), "clear corrections still need a persistent failure budget");
assert.ok(execute.includes("Count one failed attempt per implementation or fix cycle") && execute.includes("Expected TDD RED is not a failed attempt"), "count failed implementation cycles, not expected RED or individual failing assertions");
assert.ok(taskReview.includes("stricter commit gate than the shared severity defaults"), "distinguish impact grading from execute's commit policy");
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
const gitEnv = { ...Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.toUpperCase().startsWith("GIT_"))), GIT_CONFIG_GLOBAL: join(fixture, "global-config"), GIT_CONFIG_NOSYSTEM: "1" };
const git = (...args) => execFileSync("git", ["-C", fixture, "-c", "user.name=Example checks", "-c", "user.email=checks@example.invalid", "-c", "commit.gpgsign=false", ...args], {
  encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 10000, env: gitEnv,
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
  const reviewCommands = blocks(reviewFile, "bash").flatMap((source) => source.split("\n"));
  const resolvers = reviewCommands.filter((source) => /^git rev-parse /.test(source));
  assert.equal(resolvers.length, 2, "resolve base and head separately");
  const [reviewBase, reviewHead] = resolvers.map((source) => git(...source.replaceAll("<review-base>", "HEAD~5").replaceAll("<review-head>", "HEAD~2").replaceAll('"', "").split(/\s+/).slice(1)).trim());
  assert.equal(reviewBase, git("rev-parse", "HEAD~5").trim());
  assert.equal(reviewHead, git("rev-parse", "HEAD~2").trim(), "explicit historical head must not become HEAD");
  assert.equal(git("log", `${reviewBase}..${reviewHead}`, "--format=%s").trim(), "initial 5\ninitial 4\ninitial 3");
  assert.equal(git("show", `${reviewHead}:value`).trim(), "5", "read context at the historical head");
  assert.ok(read(reviewFile).includes("git show <review_head_sha>:<path>"));
  const commands = reviewCommands.filter((source) => /^git (diff|log) /.test(source));
  assert.deepEqual([...reviewer.matchAll(/^Diff command: (.+)$/gm)].map(([, command]) => command), ["<pinned_diff_command>"], "the single reviewer must receive the selected comparison unchanged");
  const ranges = commands.map((source) => {
    const args = source.replaceAll("<review_base_sha>", reviewBase).replaceAll("<review_head_sha>", reviewHead).split(/\s+/).slice(1);
    return [args, git(...args)];
  });
  assert.equal(ranges.length, 3, "check endpoint diff, branch diff, and the pinned commit log");
  for (let n = 8; n <= 10; n++) {
    writeFileSync(join(fixture, "value"), `${n}\n`);
    git("add", "value");
    git("commit", "-qm", `fix ${n}`);
  }
  assert.notEqual(git("rev-parse", "HEAD~5").trim(), reviewBase);
  for (const [args, expected] of ranges) assert.equal(git(...args), expected, "the documented review range moved after fix commits");
  git("switch", "-qc", "comparison-base", reviewBase);
  writeFileSync(join(fixture, "base-only"), "not part of the reviewed branch\n");
  git("add", "base-only");
  git("commit", "-qm", "base-only change");
  const divergedBase = git("rev-parse", "HEAD").trim();
  const diffs = ranges.filter(([args]) => args[0] === "diff").map(([args]) => git(...args.map((arg) => arg.replaceAll(reviewBase, divergedBase))));
  assert.match(diffs[0], /base-only/, "endpoint comparison includes differences on both sides");
  assert.doesNotMatch(diffs[1], /base-only/, "branch comparison excludes base-only changes");
  git("switch", "-q", "feature/example-check");
  const taskFile = join(fixture, "task-file");
  writeFileSync(taskFile, "user-staged: old\nuser-unstaged: old\ntask: old\n");
  git("add", "task-file");
  git("commit", "-qm", "task baseline");
  const taskBase = git("rev-parse", "HEAD").trim();
  writeFileSync(taskFile, "user-staged: changed\nuser-unstaged: old\ntask: old\n");
  git("add", "task-file");
  const startingContents = "user-staged: changed\nuser-unstaged: changed\ntask: old\n";
  writeFileSync(taskFile, startingContents);
  const startingSnapshot = join(fixture, "task-start");
  writeFileSync(startingSnapshot, startingContents);
  writeFileSync(taskFile, startingContents.replace("task: old", "task: changed"));
  const candidateDiff = git("diff", taskBase, "--", "task-file");
  for (const change of ["user-staged: changed", "user-unstaged: changed", "task: changed"]) assert.ok(candidateDiff.includes(`+${change}`), `candidate diff must expose ${change}`);
  const increment = spawnSync("git", ["-C", fixture, "diff", "--no-index", "--unified=0", "--", startingSnapshot, taskFile], { encoding: "utf8", timeout: 10000, env: gitEnv });
  if (increment.error) throw increment.error;
  assert.equal(increment.status, 1, increment.stderr); // git diff returns 1 for a non-empty increment.
  assert.match(increment.stdout, /^\+task: changed$/m);
  assert.doesNotMatch(increment.stdout, /^[+-]user-/m, "review only the task-start-to-current increment, not pre-existing user changes");
  assert.match(git("diff", "--cached", "--", "task-file"), /^\+user-staged: changed$/m, "review must preserve the user's index");
  assert.match(git("diff", "--", "task-file"), /^\+user-unstaged: changed$/m, "review must preserve the user's unstaged changes");
  assert.equal(git("branch", "--show-current").trim(), "feature/example-check");
} finally {
  rmSync(fixture, { recursive: true, force: true });
}

let state;
try {
  state = JSON.parse(blocks("skills/autoflow/references/state-management.md", "json")[0]);
} catch (error) {
  assert.fail(`Invalid autoflow state example: ${error.message}`);
}
assert.equal(state.version, 4, "conversation-only reviews need a distinct recovery schema");
assert.ok(!Object.hasOwn(state, "review_report"), "state must not depend on a saved review report");
for (const field of ["review_head", "fix_head"]) assert.equal(state[field], null, `${field} starts explicitly empty`);
const recovery = read("skills/autoflow/references/state-management.md");
for (const rule of ["Do not store review findings", "cannot prove the verdict", "conversation feedback cannot be recovered", "repeat the read-only whole-feature review from the original", "does not authorize a second fix wave", "If state is invalid or incomplete, stop"]) {
  assert.ok(recovery.includes(rule), `missing conversation-only recovery gate: ${rule}`);
}
assert.ok(read("skills/autoflow/SKILL.md").includes("acceptance of the stated inline-review limitation"), "autoflow must not call self-review independent assurance");
assert.deepEqual(state.approval.spec_appendix_blobs, {}, "explicitly record an empty appendix snapshot when no appendix is required");
assert.ok(read("skills/autoflow/references/state-management.md").includes("snapshot all contract documents"), "recovery must validate required internal appendices as well as spec.md");
for (const input of ["spec", "plan", "ui_spec", "design"]) {
  assert.ok(Object.hasOwn(state, input), `missing approved input path: ${input}`);
  assert.ok(Object.hasOwn(state.approval, `${input}_blob`), `missing approved input snapshot: ${input}`);
}
assert.ok(read("skills/autoflow/references/state-management.md").includes("added, removed, or changed"), "recovery must detect presence changes as well as modified contents");

const debug = read("skills/debug/SKILL.md");
const workspaceGate = debug.indexOf("./references/repository-changes.md");
assert.ok(workspaceGate >= 0 && workspaceGate < debug.indexOf("## Phase 1:"), "shared workspace safety must precede probes and hypothesis edits");
assert.doesNotMatch(debug, /initial staged and unstaged|default branch|Redact secrets/, "debug must delegate generic safety to the shared reference");
assert.ok(debug.includes("proceed directly to Phase 4"), "an evidenced root cause must not require exhaustive investigation");
assert.ok(!/under about 20 lines|1-2 files|List every difference/.test(debug), "bug-fix workflow must follow uncertainty, not size quotas");
assert.ok(!/git branch -[dD]|## Present the options|typed `discard`/.test(finish), "execute must not carry a branch-disposal workflow");
const ideate = read("skills/ideate/SKILL.md");
assert.ok(ideate.includes("If no approach survives") && ideate.includes("stop without requesting a selection or recommending a next skill"), "ideation must save a no-viable-option result without forcing a choice or handoff");
assert.ok(ideate.includes("rejected approaches and conflicting constraints") && ideate.includes("or why none fits"), "a proposal must preserve why no candidate fits");
assert.ok(ideate.includes("already selected and no new evidence invalidates it") && ideate.includes("a ready, supported choice goes directly to `spec`"), "supported selections need no repeated ideation");
assert.ok(ideate.includes("Choosing a probe target is not final selection") && ideate.includes("stop before final selection or a specification handoff"), "candidate probes must precede final approach selection");
assert.ok(ideate.includes("Inconclusive evidence leaves its premise unresolved, not disproved or supported") && ideate.includes("If evidence rules out all current candidates, revise them within the requested scope"), "ideation must consume evidence, distinguish gaps from rejection, and reconsider failed candidates");
assert.ok(ideate.includes("An updated proposal does not revise an approved contract or authorize resuming work"), "reopened design must not bypass downstream approvals");
assert.ok(ideate.includes("keep earlier candidates") && designInput.includes("Append a changed selection") && designInput.includes("different scope needs a distinct semantic directory"), "proposals must preserve prior work and separate different scopes");
assert.ok(!ideate.includes("different topic") && ideate.includes("./references/design-input.md"), "ideation must use the shared delivery-scope rules, not create directories per topic");
assert.ok(ideate.includes("run experiments or product acceptance checks") && !ideate.includes("perform validation"), "ideation must forbid experiments and product acceptance, not read-only fact checks");
const dispatch = read("shared/references/subagent-dispatch.md");
assert.ok(dispatch.includes("For exploration") && dispatch.includes("only when the invoking skill calls for independent review") && dispatch.includes("exploration alone does not add a review stage"), "shared dispatch guidance must not turn exploration into independent review");
assert.ok(ideate.includes("proposal.md") && !ideate.includes(".coding/ideation/"), "new proposals must use the permanent scope directory");
assert.ok(!ideate.includes("that's Phase 2"), "ideation must not promise prototypes in Phase 2");
assert.ok(!read("skills/refactor/SKILL.md").includes("Never write a refactor report into the repository"), "temporary report writes are allowed; commits are not");
assert.ok(!read("shared/references/counterfactual-test.md").includes("barely passes"), "generic security advice fails the counterfactual gate");
const metrics = read("skills/simplify/references/complexity-metrics.md");
assert.ok(!metrics.includes(".coding/simplify-config.toml"), "reuse project analyzer settings instead of an undocumented config");
assert.ok(!/\d+ 个真实代理行为场景/.test(readme), "do not hardcode a drifting manual-case count");
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
for (const skill of ["execute", "debug", "optimize"]) {
  assert.ok(read(`skills/${skill}/SKILL.md`).includes("Unavailable required checks"), `${skill} must use the shared unavailable-check gate`);
}
const optimize = read("skills/optimize/SKILL.md");
const optimizeDoD = optimize.indexOf("./references/definition-of-done.md");
assert.ok(optimizeDoD >= 0 && optimizeDoD < optimize.indexOf("## Process"), "optimize must choose checks from the DoD before starting");
assert.ok(optimize.includes("applicable pre-commit checks pass") && optimize.includes("final verification"), "performance gains must not replace commit or completion checks");
assert.ok(read("skills/autoflow/SKILL.md").includes("unavailable required verification"), "autoflow must not advance past missing required verification");
const tdd = read("shared/references/tdd.md");
assert.ok(tdd.includes("Do not repeat a trustworthy RED/GREEN cycle"), "unchanged deterministic tests must reuse observed proof");
assert.ok(tdd.includes("test or fixture changed") && tdd.includes("failure cause was unclear"), "uncertain proof still needs a fresh guard check");
const plan = read("skills/plan/SKILL.md");
assert.ok(plan.includes("Run-only verification belongs in Final verification"), "verification commands alone must not create a task");
assert.ok(plan.includes("A saved plan contains task details") && plan.includes("Neither tier requires task briefs by default"), "a short persisted plan must be usable without task briefs");
assert.ok(read("skills/doc-review/references/review-lenses.md").includes("a self-contained plan requires no briefs"), "document review must not restore mandatory task briefs");
const outputTier = read("skills/plan/references/output-tier.md");
assert.ok(outputTier.includes("A short plan may use Full simply to survive a pause") && !/Hard floors|at most 5 files/.test(outputTier), "persistence must not impose size or module gates");
assert.ok(plan.includes("Before any Full-plan, brief, or existing-ledger write, read `./references/repository-changes.md`") && plan.includes("Draft approval does not authorize"), "saved-plan writes need shared workspace protection without treating draft approval as permission to overwrite unrelated work");
assert.ok(plan.includes("same task fields") && plan.includes("For Brief, revise the conversation plan without creating files"), "session plans keep the full task contract without saved-plan bookkeeping");
assert.ok(execute.includes("equivalent commands") && execute.includes("do not rewrite the approved plan or briefs") && execute.includes("even when product scope is unchanged"), "execution corrections must not bypass semantic plan revision");
const stableIds = read("shared/references/stable-ids.md");
assert.ok(stableIds.includes("establishing or preserving") && stableIds.includes("Existing coverage") && stableIds.includes("Do not invent a development task, completed task, or historical commit"), "existing behavior needs evidence and final checks, not fabricated implementation history");
assert.ok(stableIds.includes("or existing behavior with implementation/test evidence and a final verification check"), "requirement coverage must include unchanged existing behavior");
assert.ok(!decomposition.includes("Horizontal Filling") && decomposition.includes("several tightly related acceptance conditions") && decomposition.includes("not automatic follow-up tasks"), "decomposition must follow cohesive approved work rather than a layer/phase taxonomy");
const spec = read("skills/spec/SKILL.md");
assert.ok(spec.includes("only routine specification approval checkpoint") && spec.includes("short spec and one approval"), "local requirement decisions need one contract approval, not a separate product stage");
assert.ok(spec.includes("Do not require `ideate`, `spike`") && spec.includes("Do not write product code, run experiments"), "ready designs must go directly to spec without experiments");
assert.ok(spec.includes("A missing user decision") && spec.includes("even when security-critical") && spec.includes("a factual feasibility premise"), "spec must distinguish important behavior decisions from unsupported feasibility premises");
assert.ok(!spec.includes("critical contract lacks applicable evidence"), "an important contract decision alone must not force an ideate detour");
for (const rule of ["complete product contract", "they cannot override it", "Deferring an open presentation choice never permits dropping supplied, settled UI decisions", "jointly govern implementation"]) {
  assert.ok(designInput.includes(rule), `missing product/UI authority boundary: ${rule}`);
}
assert.ok(spec.includes("## Remaining presentation decisions") && spec.includes("Recommend `ui-design` first"), "spec must name deferred presentation decisions and resolve them before dependent planning");
const specRevision = spec.split("## Revisions\n")[1].split("\n## ")[0];
for (const input of ["required internal appendices in full", "approved `ui-spec.md`", "`DESIGN.md`", "affected plan tasks"]) {
  assert.ok(specRevision.includes(input), `spec revision must inspect ${input}`);
}
assert.ok(specRevision.includes("Spec approval does not renew approval of conflicting UI decisions or a stale plan") && specRevision.includes("Do not edit UI documents, tasks, or execution records here"), "spec revision must report stale downstream inputs without renewing their approval or editing them");
const uiDesign = read("skills/ui-design/SKILL.md");
assert.ok(uiDesign.includes("stop and recommend `spec` for that decision before UI approval"), "UI approval must not change the product contract");
assert.ok(plan.includes("Do not silently plan from contradictory inputs") && plan.includes("otherwise `ui-design` to realign the presentation"), "planning must stop for product/UI conflicts and name the affected owner");
const elicitation = read("skills/spec/references/elicitation.md");
assert.doesNotMatch(elicitation, /Don't accept the first answer|First Principles|Counterfactual Thinking|Constraint Relaxation|Alternatives emerge/, "spec elicitation must not prescribe reopening selected mechanisms or relaxing agreed scope");
assert.ok(elicitation.includes("These techniques do not authorize comparing replacement approaches, relaxing agreed constraints, or running experiments"), "elicitation techniques must stay within the spec readiness boundary");
assert.ok(read("skills/spec/references/adr-format.md").includes("All three of these must be true"), "ADR eligibility must remain in its owning reference");
assert.doesNotMatch(spec + read("skills/spec/references/domain-modeling.md"), /hard to reverse|surprising without context|all three/i, "spec and domain modeling must refer to ADR eligibility rather than duplicate it");
assert.ok(plan.includes("This skill alone decomposes delivery work") && plan.includes("Do not create capability maps, child specs"), "plan must own implementation decomposition without recursive specifications");
assert.ok(plan.includes("Do not schedule completed selection experiments again as unfinished work"), "completed feasibility evidence must not become unfinished implementation work");
for (const skill of ["spec", "plan", "execute", "autoflow", "debug", "optimize", "refactor"]) {
  assert.ok(read(`skills/${skill}/SKILL.md`).includes("`ideate`"), `${skill} must return unresolved design to its owner`);
  for (const file of readdirSync(new URL(`../skills/${skill}/`, import.meta.url), { recursive: true }).filter((file) => file.endsWith(".md"))) {
    assert.doesNotMatch(read(`skills/${skill}/${file}`), /(?:recommend (?:a targeted )?|needs (?:targeted )?|goes to )`spike`/, `${skill}/${file} must not send downstream work directly to spike`);
  }
}
for (const file of readdirSync(new URL("../skills/", import.meta.url), { recursive: true }).filter((file) => file.endsWith(".md"))) {
  assert.ok(!/`clarify`|skills\/clarify\//.test(read(`skills/${file}`)), `retired entry in ${file}`);
}
const commit = read("skills/commit/SKILL.md");
assert.ok(commit.includes("Do not ask again for file or message approval unless the user requested a preview"), "explicit commit scope must not require routine reapproval");
assert.ok(commit.includes("scope is ambiguous") && commit.includes("git diff --staged") && commit.includes("Respect required checks and hooks"), "commit shortcuts must retain scope, staging, and check safeguards");
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
assert.ok(finish.includes("Keep the current branch") && finish.includes("not another approval choice"), "every input type must finish with the branch kept, without a menu");
assert.ok(finish.indexOf("Keep the current branch") > finish.indexOf("final verification and Definition of Done"), "default keep must not bypass verification");
assert.ok(read("skills/handoff/SKILL.md").includes("Do not infer a skill stage"), "handoff must not invent a phase from the topic");
console.log("example and contract checks passed: endpoint examples, async cleanup, loading labels, complexity, bounded execution, task-owned increments, pinned historical/endpoint/branch review, comprehensive conversation-only review and recovery, branch-preserving handoff, spike safety and completion gates");
console.log(`Validated ${workflowCases.length} manual workflow cases; no agent runs or behavioral pass claims.`);
