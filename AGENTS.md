# Dima — agent instructions

Dima is a set of guardrails and starting points that let coding agents
build backends fast and safely, built on Effect v4: an invariant kernel on
npm, recipes installed and owned by projects, and decision guides for agents.

## Read first

- `docs/CONTEXT.md` — project index: principles, decisions (ADRs), roadmap.
- `docs/effect-landscape.md` — what Effect already provides, the idioms we use,
  and verified facts. Check it before designing or building anything; use
  Effect rather than reimplementing it.

## Effect reference

Use the Effect version installed in this repo, not memory or web results.

- `node_modules/effect/AGENTS.md` — how to write Effect v4 code (services,
  errors, resources, running, testing, and each module).
- `node_modules/effect/ai-docs/src/` — compiled, runnable examples by topic.
- `node_modules/effect/src/` — source and JSDoc for exact signatures and
  `@stability` labels.

## Rules

- Follow the idioms in `docs/effect-landscape.md#idioms-we-use`: one idiom per
  concern.
- Non-trivial decisions about Dima get an ADR (`docs/adr/README.md`).
  Specs are written after the slice that builds a module
  (`docs/specs/README.md`). Keep `docs/CONTEXT.md` current.
- Kernel or recipe? If getting it wrong is a bug an agent must not be able to
  introduce, it belongs in the kernel; if it's where a project's specifics show
  up, it's a recipe (ADR-0005).
- Nothing in the kernel depends on a specific agent tool (ADR-0006).
- Never write to or create a database that isn't a sandbox; never push
  (ADR-0015).
- Every dependency is pinned exactly in the `catalog` of
  `pnpm-workspace.yaml` (ADR-0004); depend on it with `"catalog:"`.

## Definition of done

This repo follows the definition of done it ships (ADR-0017): checks pass,
behaviour changes have a test that exercises them, and the final report
includes the evidence. Compiling isn't done.

Run `pnpm check` (type-check with Effect diagnostics, lint, tests) until
`dima check` replaces it.
