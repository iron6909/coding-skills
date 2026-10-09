#!/usr/bin/env node
// Keeps the few genuinely shared reference files byte-identical across the
// skills that ship them. A skill is installed as a directory, so a skill can
// never read a sibling skill's files; every consumer needs its own copy.
//
// Source of truth: shared/references/
// Usage:
//   node scripts/sync-references.mjs           # write copies
//   node scripts/sync-references.mjs --check   # verify, exit 1 on drift

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// source file -> skill directories that ship a copy
const MAP = {
  "glossary-format.md": ["init", "clarify"],
  "subagent-dispatch.md": ["init", "clarify", "plan", "review", "research"],
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

if (check) {
  if (drift > 0) {
    console.error(`\n${drift} file(s) out of sync. Run: node scripts/sync-references.mjs`);
    process.exit(1);
  }
  console.log("shared references in sync");
} else {
  console.log(written > 0 ? `\n${written} file(s) written.` : "already in sync");
}
