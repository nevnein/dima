# ADR-0002: Vision and principles

- **Status:** Accepted
- **Date:** 2026-10-25
- **Related:** all ADRs

## Context

Coding agents now write most backend code. Writing code is rarely the hard
part any more. The hard parts are:

- keeping agent-written code safe and reviewable (authorization, migrations,
  data access, production access),
- adapting it to an existing context (database, conventions, infrastructure),
- choosing the right paradigm and infrastructure for each problem.

Toolbelt is a personal toolkit, not a market product. It should also save the
author from starting from scratch on every project.

## Decision

Toolbelt is **a set of guardrails and starting points that let agents build
backends fast and safely**, built on Effect v4. It is not a Laravel-style
framework: no generators, no ORM, no magic.

Its principles, ordered from purpose to means:

1. **Safe by default.** The real boundary is credentials that aren't present:
   writes go only to sandboxes, production is reachable only through the
   pipeline, nothing is pushed by default (ADR-0015).
2. **Guardrails over generators.** Whatever agents must not get wrong is
   enforced, never just documented, in order of strength: unrepresentable,
   diagnostics, lint, generated tests, runtime guards. Every escape is
   declared, has a reason, and gets reviewed (ADR-0007, ADR-0008).
3. **Prove it works.** `toolbelt check` and `toolbelt verify`. Done means
   evidence, not "it compiles". Every service can be replaced with a test
   layer, and time-dependent code works with `TestClock` (ADR-0017).
4. **Adapt to the context.** Detect first, ask what can't be detected, adopt
   existing conventions. Decisions are data, logged, and each says who may
   take it (ADR-0009, ADR-0010, ADR-0012).
5. **An invariant kernel, owned recipes.** The kernel is updatable on npm and
   never modified in projects. Recipes are advanced starting points:
   installed, adapted, then owned by the project (ADR-0005).
6. **Visible to agents.** Everything the app does (errors, traces, logs,
   routes) can be read locally through the CLI (ADR-0016).
7. **Agent-agnostic.** Shared standards (`AGENTS.md`, Agent Skills, MCP) and a
   CLI. Tool-specific setup only through adapter commands (ADR-0006).
8. **Use Effect, constrain it, don't wrap it.** Effect is the means: typed
   errors, requirements and tracing make principles 1–6 enforceable. Plain
   Effect code, narrowed to one idiom per concern, never hidden behind our own
   API (ADR-0003).
9. **Start small, stay honest about stability.** Proof of concept first. Node;
   Postgres, SQLite, MySQL/MariaDB. Pre-1.0 while the Effect modules
   underneath are unstable (ADR-0004, ADR-0018).

## Consequences

- Every design is judged first by agent safety and speed, then by starting-point
  value.
- Market and adoption concerns don't drive decisions.
- Features that only save typing (scaffolding generators, ORM layers) are out
  of scope.

## Alternatives considered

- **A Laravel-style framework on Effect** — the original framing. Its value was
  saving typing and offering familiar DX for humans; agents erode the first,
  and the second isn't the goal.
- **No layer between API and database** (DB-as-API, or an LLM writing queries
  at request time) — CRUD-only, moves authorization into hard-to-get-right
  places, and in the runtime variant gives up contracts, determinism and
  safety.
