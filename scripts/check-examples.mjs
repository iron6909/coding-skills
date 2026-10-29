import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runInNewContext } from "node:vm";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8").replace(/\r\n/g, "\n");
const blocks = (path, language) => [...read(path).matchAll(new RegExp(`\`\`\`${language}\\r?\\n([\\s\\S]*?)\\r?\\n\`\`\``, "g"))].map((match) => match[1]);

// ponytail: structure and runnable examples only; rule-wording regressions surface in workflow-case runs, so run those before releasing skill-rule changes.
const manifest = JSON.parse(read("package.json"));
assert.ok(manifest.keywords.includes("pi-package"), "the package must be discoverable as a Pi package");
assert.deepEqual(manifest.pi.skills, ["./skills"], "Pi must load the existing self-contained skill directories");
assert.deepEqual(manifest.pi.extensions, ["./extensions/index.ts"], "Pi must load the single command adapter");
assert.equal(manifest.type, "module");
assert.deepEqual(manifest.peerDependencies, { "@earendil-works/pi-coding-agent": "*" }, "Pi provides the host, not a bundled runtime dependency");
assert.ok(!manifest.dependencies, "the adapter must not add runtime packages");
assert.deepEqual(manifest.files, ["extensions", "skills", "README.md", "LICENSE"], "publish resources and user-facing documents, not development rules");
for (const command of ["node scripts/sync-references.mjs --check", "node scripts/sync-references.test.mjs", "node scripts/check-examples.mjs", "node scripts/check-simplify-trace.mjs --self-test", "node scripts/pi-extension.test.mjs", "git diff --check", "npm pack --dry-run --json --offline"]) {
  assert.ok(manifest.scripts?.check?.split(" && ").includes(command), `npm run check must include ${command}`);
}

const readme = read("README.md");
const installedSkills = readdirSync(new URL("../skills/", import.meta.url), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
const listedSkills = ["核心技能", "辅助技能"].flatMap((label) => {
  const section = readme.split(`### ${label}`)[1]?.split("\n#")[0] ?? "";
  return [...section.matchAll(/\]\(skills\/([\w-]+)\/SKILL\.md\)/g)].map(([, name]) => name);
});
assert.deepEqual(listedSkills.sort(), installedSkills, "README must classify every installed skill exactly once");
for (const skill of installedSkills) {
  const source = read(`skills/${skill}/SKILL.md`);
  assert.match(source, new RegExp(`^name: ${skill}$`, "m"), `${skill} must retain its portable name`);
  assert.doesNotMatch(source, /^disable-model-invocation:/m, `${skill} must use default model-selected invocation`);
  const description = source.match(/^description: (.+)$/m)?.[1] ?? "";
  assert.ok(description.length > 0 && description.length <= 1024, `${skill} needs a nonempty, portable description`);
  assert.ok(source.includes("./references/repository-changes.md"), `${skill} must load shared repository safety`);
}
for (const file of readdirSync(new URL("../skills/", import.meta.url), { recursive: true }).filter((file) => file.endsWith(".md"))) {
  const source = read(`skills/${file}`);
  assert.doesNotMatch(source, /`(?:clarify|debug|capture|optimize|handoff)`|skills\/(?:clarify|debug|capture|optimize|refactor|handoff)\//, `retired entry in ${file}`);
  assert.doesNotMatch(source.replaceAll("...", ""), /\.\.\//, `non-portable parent path in ${file}`);
}

const workflowCases = JSON.parse(read("scripts/workflow-cases.json"));
assert.ok(Array.isArray(workflowCases) && workflowCases.length > 0, "the manual workflow case set must be a non-empty array");
assert.equal(new Set(workflowCases.map(({ id }) => id)).size, workflowCases.length, "workflow case IDs must be unique");
for (const item of workflowCases) {
  assert.match(item.id, /^[a-z][a-z0-9-]+$/);
  assert.ok(installedSkills.includes(item.skill), `unknown workflow skill: ${item.skill}`);
  for (const key of ["setup", "prompt"]) assert.ok(typeof item[key] === "string" && item[key].trim(), `${item.id}: missing ${key}`);
  for (const key of ["expect", "forbid"]) assert.ok(Array.isArray(item[key]) && item[key].length > 0 && item[key].every((value) => typeof value === "string" && value.trim()), `${item.id}: missing ${key}`);
}

const endpointExamples = blocks("skills/execute/references/testing-strategy.md", "javascript").filter((source) => source.includes(".post('/api/login')"));
assert.equal(endpointExamples.length, 1, "keep one public-interface test example");
for (const check of ["toBe(200)", "toBe(401)", "toBeUndefined()"]) assert.ok(endpointExamples[0].includes(check), `missing endpoint assertion: ${check}`);

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

const labelExample = blocks("skills/simplify/references/simplify-dimensions.md", "javascript").find((source) => source.includes("function createLabelBefore("));
assert.ok(labelExample, "missing behavior-preserving simplification example");
const labelImplementations = runInNewContext(`${labelExample}\n({ before: createLabelBefore, after: createLabelAfter })`, {}, { timeout: 1000 });
const behaviorFailure = new Error("effect failed");
const replyResult = Symbol("reply result");
const observeLabel = (fn, label, failAt) => {
  const events = [];
  const effect = (kind, value) => {
    events.push([kind, value]);
    if (kind === failAt) throw behaviorFailure;
  };
  const reply = {
    status(code) { effect("status", code); return this; },
    json(body) { effect("json", body); return replyResult; },
  };
  try {
    const result = fn(label, reply, (value) => { effect("save", value); return value; });
    return { result, error: null, events };
  } catch (error) {
    return { result: undefined, error, events };
  }
};
for (const label of [null, "", "label", undefined, 0, false, [], {}, Symbol("label")]) {
  for (const failAt of [undefined, "status", "json", "save"]) {
    const before = observeLabel(labelImplementations.before, label, failAt);
    const after = observeLabel(labelImplementations.after, label, failAt);
    assert.deepEqual(after, before, "preserve returns, response bodies, thrown errors and effect order");
    assert.equal(after.result, before.result, "preserve result identity, not just equal values");
    assert.equal(after.error, before.error, "propagate the original thrown error");
  }
}
const missingLabel = observeLabel(labelImplementations.after, null);
assert.equal(missingLabel.result, replyResult);
assert.deepEqual(missingLabel.events.map(([kind]) => kind), ["status", "json"]);
assert.equal(missingLabel.events[0][1], 400);
assert.equal(missingLabel.events[1][1].error, "Missing label");
assert.equal(observeLabel(labelImplementations.after, "label", "save").error, behaviorFailure);
console.log("simplification example preserves responses, result identity, errors and effect order");

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
    git("add", "--", "value");
    git("commit", "-qm", `initial ${n}`);
  }
  git("switch", "-qc", "feature/example-check");
  const reviewCommands = blocks("skills/code-review/SKILL.md", "bash").flatMap((source) => source.split("\n"));
  const resolvers = reviewCommands.filter((source) => /^git rev-parse /.test(source));
  assert.equal(resolvers.length, 2, "resolve base and head separately");
  const [reviewBase, reviewHead] = resolvers.map((source) => git(...source.replaceAll("<review-base>", "HEAD~5").replaceAll("<review-head>", "HEAD~2").replaceAll('"', "").split(/\s+/).slice(1)).trim());
  assert.equal(reviewBase, git("rev-parse", "HEAD~5").trim());
  assert.equal(reviewHead, git("rev-parse", "HEAD~2").trim(), "explicit historical head must not become HEAD");
  const ranges = reviewCommands.filter((source) => /^git (diff|log) /.test(source)).map((source) => {
    const args = source.replaceAll("<review_base_sha>", reviewBase).replaceAll("<review_head_sha>", reviewHead).split(/\s+/).slice(1);
    return [args, git(...args)];
  });
  assert.equal(ranges.length, 3, "check endpoint diff, branch diff, and the pinned commit log");
  for (let n = 8; n <= 10; n++) {
    writeFileSync(join(fixture, "value"), `${n}\n`);
    git("add", "value");
    git("commit", "-qm", `fix ${n}`);
  }
  for (const [args, expected] of ranges) assert.equal(git(...args), expected, "the documented review range moved after fix commits");
  git("switch", "-qc", "comparison-base", reviewBase);
  writeFileSync(join(fixture, "base-only"), "not part of the reviewed branch\n");
  git("add", "base-only");
  git("commit", "-qm", "base-only change");
  const divergedBase = git("rev-parse", "HEAD").trim();
  const diffs = ranges.filter(([args]) => args[0] === "diff").map(([args]) => git(...args.map((arg) => arg.replaceAll(reviewBase, divergedBase))));
  assert.match(diffs[0], /base-only/, "endpoint comparison includes differences on both sides");
  assert.doesNotMatch(diffs[1], /base-only/, "branch comparison excludes base-only changes");
} finally {
  rmSync(fixture, { recursive: true, force: true });
}

console.log("structure and example checks passed: manifest, skill layout and portability, workflow cases, test and UI examples, simplification behavior, pinned review ranges");
console.log(`Validated ${workflowCases.length} manual workflow cases; no agent runs or behavioral pass claims.`);
