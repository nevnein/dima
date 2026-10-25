# ADR-0019: Name the project Dima, published as `@nevnein/dima`

- **Status:** Accepted
- **Date:** 2026-10-25
- **Related:** ADR-0002, ADR-0005

## Context

"Toolbelt" was a working name, and the unscoped `toolbelt` package is taken on
npm. The name is typed constantly: the CLI (`dima check`, `dima dev logs`),
imports, and escape-hatch comments. Every short English word checked (jig,
keel, belay, plumb, trellis, …) is taken unscoped on npm and as a GitHub name.
The project is personal (ADR-0002), so a personal npm scope costs nothing.

## Decision

1. The project is named **Dima**, Italian for a jig or template: a fixture
   that holds the work and guides the tool so every cut is repeatable and
   safe. The agent is the tool; Dima constrains it without doing the work,
   matching "guardrails over generators" and "constrain Effect, don't wrap
   it".
2. The kernel is published as **`@nevnein/dima`**. Its binary is **`dima`**
   (`bin` in its `package.json`), so commands read `dima check`.
3. Derived names: the workspace package lives in `packages/dima`, escape
   hatches are written `// dima-allow <rule-id> <reason>: <explanation>`
   (ADR-0008), and agent knowledge is read from
   `node_modules/@nevnein/dima/` (ADR-0005).

## Consequences

- The scoped name is guaranteed available and can't be squatted.
- Imports are longer (`@nevnein/dima`) than a bare name would be.
- Web and GitHub searches for "dima" are noisy (a common Russian nickname,
  "always" in Maghrebi Arabic, a TU Berlin research group); the scoped
  package name is the reliable search term.
- The repository directory and the GitHub repo can be renamed independently;
  nothing depends on them.

## Alternatives considered

- **`jig`** — the same meaning in English; taken on npm, and Dima was
  preferred.
- **Unscoped `dima`** — held by a one-off test package from 2025; a dispute
  is possible but unnecessary.
- **`dima-ts`** — taken by an abandoned generated stub, and the `-ts` suffix
  carries no information.
- **`dimajs`, `dima-kit`** — free unscoped, but a scope is cleaner.
- **Generator words (scaffold, forge, starter)** — contradict ADR-0002.
- **`harness`** — clashes with "agent harness"; **`rails`** — clashes with
  Rails; **`effect-…`** — looks like an official Effect package.
