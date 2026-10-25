# ADR-0007: Guardrail model and rule catalogue

- **Status:** Accepted
- **Date:** 2026-10-25
- **Related:** ADR-0003, ADR-0008, ADR-0017

## Context

The type checker alone doesn't catch missing authorization, destructive
migrations, N+1 queries, missing timeouts, production access, or v3-era
Effect habits. Existing projects bring their own linters. Agents work best
when an error message states the fix.

## Decision

**Enforcement order**, strongest first. A guardrail is placed as high as
possible:

1. **Unrepresentable** — the kernel's API doesn't let the wrong thing
   type-check (for example, an HTTP client that can't be built without a
   timeout and retry `Schedule`; handlers whose requirements may not include a
   raw data client).
2. **Effect diagnostics** at error severity, via **TypeScript 7 and
   `@effect/tsgo`** (`floatingEffect`, `missingReturnYieldStar`,
   `leakingRequirements`, `outdatedApi`, …).
3. **Lint**, from the rule catalogue.
4. **Test helpers** — query budget, generated authorization tests,
   duplicate-run tests for jobs.
5. **Migration lint** — Squawk for Postgres, per dialect otherwise (ADR-0011).
6. **Runtime guards** — environment guard, sandbox registry (ADR-0015).
7. **Integrity** — checks that the guardrails themselves are intact (ADR-0008).

**The rule catalogue** is tool-neutral and lives in the kernel. Each rule has
an ID, intent, severity, the mechanism that enforces it, and an error message
that states the fix. Backends render it into a specific tool's configuration
(`dima lint init --tool oxlint|eslint`). Custom rules are written once for
ESLint's plugin API, which oxlint's JS plugins also use; Biome is best-effort.
**oxlint** is the default for new projects. The integrity check reports which
catalogue rules a project's linter doesn't enforce.

**Initial catalogue themes:** one idiom per concern (ADR-0003); no raw data
client outside repositories; outbound calls only through the kernel client;
no `process.env` outside the configuration layer; no mutable module-level
state; no casts to kernel-branded types; no imports outside the Dima
subtree except from the border folder (ADR-0012).

## Consequences

- Most guardrails don't depend on the project's linter (types, diagnostics,
  Squawk, test helpers).
- Coverage gaps are visible, never silent.
- Custom lint rules depend on oxlint's JS plugins, which are alpha.

## Alternatives considered

- **Types only** — misses whole classes of agent mistakes.
- **One linter, required** — conflicts with adopting existing projects.
- **TypeScript 5 with `@effect/language-service` patching `tsc`** — works, but
  Effect itself targets TypeScript 7 for v4.
