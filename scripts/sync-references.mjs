#!/usr/bin/env node
// Keeps the few genuinely shared reference files byte-identical across the
// skills that ship them. A skill is installed as a directory, so a skill can
// never read a sibling skill's files; every consumer needs its own copy.
//
// Source of truth: shared/references/
// Usage:
//   node scripts/sync-references.mjs           # write copies, then report
//   node scripts/sync-references.mjs --check   # verify only, exit 1 on drift
//
// Both modes also check every skill's own references: each references/*.md is
// named in that skill's SKILL.md, and each ./references/<file> it names exists.

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// source file -> skill directories that ship a copy
const MAP = {
  "glossary-format.md": ["survey", "clarify"],
  "subagent-dispatch.md": ["survey", "clarify", "plan", "code-review", "execute", "refactor", "ideate"],
  "tdd.md": ["execute", "debug", "code-review"],
  "definition-of-done.md": ["plan", "execute", "code-review", "debug", "optimize"],
  "severity.md": ["execute", "code-review", "simplify", "doc-review", "ui-review"],
  "git-commit.md": ["survey", "clarify", "plan", "capture", "execute", "debug", "code-review", "simplify", "learning-refresh", "doc-review", "commit", "optimize"],
  "learnings-format.md": ["plan", "code-review", "capture", "learning-refresh"],
  "stable-ids.md": ["clarify", "plan", "execute"],
  "counterfactual-test.md": ["capture", "learning-refresh"],
};

const HEADER =
  "<!-- synced from shared/references/%s by scripts/sync-references.mjs: do not edit -->\n\n";

const check = process.argv.includes("--check");
let drift = 0;
let written = 0;

for (const [file, skills] of Object.entries(MAP)) {
  const source = join(ROOT, "shared", "references", file);
  if (!existsSync(source)) {
    console.error(`missing source: shared/references/${file}`);
    drift++;
    continue;
  }
  const expected = HEADER.replace("%s", file) + readFileSync(source, "utf8");

  for (const skill of skills) {
    const target = join(ROOT, "skills", skill, "references", file);
    const actual = existsSync(target) ? readFileSync(target, "utf8") : null;

    if (actual === expected) continue;

    if (check) {
      console.error(
        `drift: skills/${skill}/references/${file} ` +
          (actual === null ? "(missing)" : "differs from shared/references/" + file),
      );
      drift++;
    } else {
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, expected);
      console.log(`synced skills/${skill}/references/${file}`);
      written++;
    }
  }
}

// Not derived from MAP: each skill's own references. A reference nothing
// points to is dead, and a name with no file is a broken read.
for (const skill of readdirSync(join(ROOT, "skills"))) {
  const dir = join(ROOT, "skills", skill, "references");
  const skillMd = join(ROOT, "skills", skill, "SKILL.md");
  if (!existsSync(skillMd)) continue;
  const text = readFileSync(skillMd, "utf8");

  if (existsSync(dir)) {
    for (const ref of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      // ponytail: reuse the flat reference scan; recurse if nested references are introduced.
      const source = readFileSync(join(dir, ref), "utf8").match(
        /^<!-- synced from shared\/references\/(\S+) by scripts\/sync-references\.mjs: do not edit -->/,
      )?.[1];
      if (source && (source !== ref || !Object.hasOwn(MAP, source) || !MAP[source].includes(skill))) {
        console.error(`unmapped: skills/${skill}/references/${ref} claims shared/references/${source}`);
        drift++;
      }
      if (text.includes(ref)) continue;
      console.error(`unnamed: skills/${skill}/references/${ref} is not named in skills/${skill}/SKILL.md`);
      drift++;
    }
  }
  for (const [, ref] of text.matchAll(/\.\/references\/([\w.-]+\.md)/g)) {
    if (existsSync(join(dir, ref))) continue;
    console.error(`missing: skills/${skill}/SKILL.md names ./references/${ref}`);
    drift++;
  }
}

if (drift > 0) {
  console.error(`\n${drift} problem(s) above.`);
  process.exit(1);
}
console.log(check ? "references in sync" : written > 0 ? `${written} file(s) written.` : "already in sync");
