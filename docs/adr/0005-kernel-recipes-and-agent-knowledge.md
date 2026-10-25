# ADR-0005: Kernel, recipes and agent knowledge

- **Status:** Accepted
- **Date:** 2026-10-25
- **Related:** ADR-0002, ADR-0004, ADR-0006, ADR-0009

## Context

Dima has to do two things that pull in opposite directions:

- **enforce invariants** agents must not break, which needs code the project
  can't casually edit and that updates across projects;
- **provide advanced starting points** that fit each project's context, which
  needs code the agent can read and change freely.

Laravel 12's starter kits (code in the app, engine in `laravel/fortify`) and
Rails 8's auth generator make the same split.

## Decision

Dima ships three artifacts:

| Artifact | Job | Who changes it | How it updates |
| --- | --- | --- | --- |
| **Kernel** (npm package `@nevnein/dima`) | Invariants: guardrails, contracts, generic infrastructure | Only this repo | Version bump |
| **Recipes** (`recipes/`) | Starting points adapted to the project | The project, after installation | Never: installed recipes are owned and not synced |
| **Agent knowledge** (skills, `AGENTS.md`, decision guides) | How to choose, adapt and verify | Only this repo | Ships inside the kernel |

**Rule:** if getting it wrong is a bug the agent must not be able to
introduce, it goes in the kernel. If it's where the project's specifics show
up, it's a recipe.

- **Kernel:** the rule catalogue and diagnostics preset, `dima check` and
  `verify`, test helpers, environment guard and sandbox registry, the
  authorization primitives, background work (ADR-0014), the telemetry sink and
  `dev` commands, setup and the decision schema, contracts with test fakes
  (mail, storage).
- **Recipes:** app skeleton and wiring, HTTP API structure, SQL setup and
  migrations, auth integrations, mail and storage adapters, Dockerfile, CI,
  verification harness.
- **Agent knowledge is read in place** from `node_modules/@nevnein/dima/`: no
  copying, no sync command, always matching the installed kernel. Project
  setup adds a short pointer section to the project's `AGENTS.md`, and the
  integrity check verifies it is there. Kernel procedures that would be
  slash-command skills are CLI commands (for example
  `dima review-exceptions`).

**Repository layout** (pnpm workspace):

```
packages/dima/       the kernel (npm: @nevnein/dima)
recipes/             recipe sources (not published as packages)
examples/            example apps, assembled from recipes, tested in CI
docs/                this documentation
```

## Consequences

- The kernel's public API must be small and slow-moving: every breaking change
  lands in code projects own.
- Recipes can't receive fixes after installation; that is accepted. Generic
  logic that benefits from fixes belongs in the kernel instead.
- Guardrails in owned code could be edited away, so all enforcement lives in
  the kernel or in checks it runs.
- Agent tools don't discover skills inside `node_modules`; the `AGENTS.md`
  pointer is the only route, hence its integrity check.

## Alternatives considered

- **A framework package only** — fights the project's context; adaptations
  become configuration and escape hatches.
- **Templates only** — no updatable invariants.
- **Kernel skills copied into each project** — drift and stale copies.
