# File Path Rules

All file paths must be complete and unambiguous.

## Rules

Always use full paths with directory prefix. Never omit parent directories.

✅ **Good**:
- `src/utils/cart-total.ts:45`
- `.cartoons/avatar-upload/design.md`
- `tests/unit/auth.test.ts`

❌ **Bad**:
- `cart-total.ts` (cannot locate)
- `design.md` (ambiguous)
- `auth.test.ts` (multiple possible locations)

## Line numbers

When referring to specific code locations, always include line numbers:

✅ `src/utils/cart-total.ts:45`

❌ `src/utils/cart-total.ts` (when discussing a specific bug)

## Directory prefixes

Always include the full directory prefix from project root:

✅ `.cartoons/avatar-upload/impl/step-2.md`

❌ `impl/step-2.md` (which feature?)

## Why

Clear paths enable:
- Grep search across conversations
- Unambiguous file location in large projects
- Consistent communication between skills
- Accurate tool calls (read, edit, bash)
