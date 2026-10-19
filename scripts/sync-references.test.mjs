import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const root = mkdtempSync(join(tmpdir(), "skills-sync-"));

try {
  for (const dir of ["shared", "skills"]) cpSync(join(repo, dir), join(root, dir), { recursive: true });
  mkdirSync(join(root, "scripts"));
  const script = join(root, "scripts", "sync-references.mjs");
  cpSync(join(repo, "scripts", "sync-references.mjs"), script);
  const run = (...args) => spawnSync(process.execPath, [script, ...args], { encoding: "utf8" });
  const check = (status, message) => {
    const result = run("--check");
    assert.equal(result.status, status, result.stderr || result.error?.message);
    if (message) assert.match(result.stderr, message);
  };

  assert.equal(run().status, 0);
  check(0);
  const registered = join(root, "skills", "execute", "references", "git-commit.md");
  const expected = readFileSync(registered, "utf8");
  assert.equal(readFileSync(join(root, "skills", "simplify", "references", "git-commit.md"), "utf8"), expected);
  assert.equal(readFileSync(join(root, "skills", "optimize", "references", "definition-of-done.md"), "utf8"), readFileSync(join(root, "skills", "execute", "references", "definition-of-done.md"), "utf8"));

  const crlf = expected.replace(/\r?\n/g, "\r\n");
  writeFileSync(registered, crlf);
  check(0);
  assert.equal(run().status, 0);
  assert.equal(readFileSync(registered, "utf8"), crlf, "checkout line endings alone must not rewrite a reference");

  writeFileSync(registered, expected + "\ndrift\n");
  check(1, /drift: skills\/execute\/references\/git-commit\.md/);
  assert.equal(run().status, 0);
  check(0);

  const skill = join(root, "skills", "guide", "SKILL.md");
  const skillText = readFileSync(skill, "utf8");
  const orphan = join(root, "skills", "guide", "references", "git-commit.md");
  mkdirSync(dirname(orphan), { recursive: true });
  writeFileSync(orphan, expected);
  writeFileSync(skill, skillText + "\nRead ./references/git-commit.md before committing.\n");
  check(1, /unmapped: skills\/guide\/references\/git-commit\.md/);
  assert.equal(run().status, 1, "write mode must also reject an unregistered synced copy");
  rmSync(orphan);
  writeFileSync(skill, skillText);
  check(0);

  const source = join(root, "shared", "references", "git-commit.md");
  rmSync(source);
  check(1, /missing source: shared\/references\/git-commit\.md/);
  console.log("sync-references checks passed: normal, simplify, CRLF, drift, unmapped, missing source");
} finally {
  rmSync(root, { recursive: true, force: true });
}
