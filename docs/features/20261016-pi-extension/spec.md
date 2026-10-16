# Pi Coding Skills Extension

**Scope approval:** On 2026-10-16 the user confirmed the preceding four-task proposal with “确认，就这么办”. This document records that agreed scope; it adds no release or push authorization.

## Problem

The repository distributes portable instruction-only skills. Pi can already load these skills, but the package does not explicitly declare its Pi resources or offer a namespaced command entry point. Existing short-command examples are not Pi's native skill command syntax.

## Goal

Distribute the existing skills as a Pi package and add one small executable command adapter without replacing the skills or their approval, verification, commit, and recovery rules.

## Solution

Use Pi's native package and skill loading. Keep the existing package name, version, skill names, directories, references, and skills.sh installation. Add an explicit package manifest and one `extensions/index.ts` factory registering `/coding`.

The extension lists only this package's currently loaded skills and dispatches an explicit selection to the corresponding native `/skill:name` command. It does not parse skill frontmatter, duplicate skill instructions, register short aliases, or orchestrate later stages.

### Interfaces

- `/coding`: show available skills and usage without starting a model turn.
- `/coding <skill> [arguments]`: invoke one available package skill, preserving the argument payload.
- `/skill:<skill> [arguments]`: remains the native alternative, including when the extension is disabled.
- Discover skills through `pi.getCommands()` and verify their source paths belong to this package.
- Dispatch with `pi.sendUserMessage(..., { expandPromptTemplates: true })`. The option is necessary: expansion defaults to false.
- Busy sessions reject a launch rather than steering or silently queueing a new workflow.

## Constraints

- No new workflow engine, session state store, custom model tool, subagent system, network integration, custom terminal component, CI, or automatic installation.
- No startup writes, shell execution, automatic skill invocation, document deletion, or changes to a consumer's ignore/tracking policy.
- The extension has the host process's permissions; this is not a sandbox or programmatic enforcement of every instruction in a skill.
- Pi provides its host packages and TypeScript loader. Declare the imported host package as a `*` peer, not a bundled runtime dependency.
- Keep the portable package's Node >=18 declaration; Pi itself requires Node >=22.19. Extension self-checks may use that native TypeScript support.
- Initial integration baseline: Pi 1.3.0, Node 24.10.0, Windows. Other platforms/versions are not claimed tested without evidence.
- Publish only the extension, complete skills, and user-facing package documentation/license; exclude repository development instructions and scratch.
- No version bump, tag, merge, publish, or push is authorized.

## Acceptance

- REQ-1: Pi discovers all 19 existing skills from the local package; the npm artifact includes all their references and excludes development-only content.
- REQ-2: Existing skill files, names, explicit-invocation frontmatter, and skills.sh installation remain unchanged and independently usable.
- REQ-3: `/coding` lists this package's loaded skills without starting a model turn; no conflicting short aliases are registered.
- REQ-4: A valid selection expands the native skill, including its directory context, and preserves the user's argument payload.
- REQ-5: Unknown, missing, conflicting-source, and busy requests report a clear problem and do not launch another workflow or access an arbitrary user-supplied path.
- REQ-6: Loading/reloading does not automatically run a workflow or duplicate the command; supported interactive and non-interactive paths remain functional without terminal-only assumptions.
- REQ-7: Documentation explains installation, native and adapter syntax, capability fallbacks, permissions, validation commands, and the actual verification boundary.

## Testing Boundary

- Extend `scripts/check-examples.mjs` for manifest and portable-skill contracts.
- Add one standard-library assertion file, `scripts/pi-extension.test.mjs`, for command registration, source boundaries, payloads, no-launch errors, busy handling, and non-UI output. Mock only the small Extension API surface.
- Check the actual npm file list with `npm pack --dry-run --json`.
- Use the installed Pi loader/session APIs in an isolated scratch fixture for real package discovery, native expansion, filtering, and reload. A local fake provider can check protocol integration without network or behavioral-compliance claims.
- Reuse applicable `scripts/workflow-cases.json` scenarios for agent behavior only with actual fresh-fixture traces, diffs, check outputs, and per-expectation results under `tmp/`. Structural or mocked tests do not establish behavioral passes; unavailable checks must be reported.
- Apply the repository's checks before every task commit and fresh final checks before completion.

## Official references

- https://pi.dev/docs/latest/extensions
- https://pi.dev/docs/latest/packages
- https://pi.dev/docs/latest/skills
- Installed Pi 1.3.0 declarations and checked examples, especially `ExtensionAPI`, `SlashCommandInfo`, `SourceInfo`, and `send-user-message.ts`.
