import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const blocks = (path, language) => [...read(path).matchAll(new RegExp("```" + language + "\\r?\\n([\\s\\S]*?)\\r?\\n```", "g"))].map((match) => match[1]);

const loginExamples = blocks("skills/execute/references/testing-strategy.md", "javascript").filter((source) => source.includes("app.post('/api/login'"));
assert.equal(loginExamples.length, 2);
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
console.log("example checks passed: two login versions, rejected credentials/input, duplicate semantics, native dialog and escaped JSX guidance");
