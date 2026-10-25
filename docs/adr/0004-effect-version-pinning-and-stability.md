# ADR-0004: Effect version pinning and stability

- **Status:** Accepted
- **Date:** 2026-10-25
- **Related:** ADR-0003, ADR-0005

## Context

Effect v4 labels every module: **stable** (strict semver), **unstable** (may
break in minor releases), **experimental** (may break in patches). Most
modules Dima relies on are unstable: `http-api`, `sql`, `persistence`,
`cluster`, `workflow`, `ai`. Effect's packages (`effect`, `@effect/platform-*`,
`@effect/sql-*`) share one version number and must be upgraded together.

## Decision

1. **Pin exactly.** The kernel depends on an exact `effect` version and the
   same version for every `@effect/*` package, through the `catalog` in
   `pnpm-workspace.yaml`. Workspace packages use `"catalog:"`.
2. **Upgrades are deliberate.** Each Effect upgrade is its own change: full
   `dima check --full`, and a re-survey of
   [effect-landscape.md](../effect-landscape.md).
3. **Same stability labels.** Every kernel module declares stable, unstable or
   experimental with Effect's meanings, and can be no more stable than what it
   exposes.
4. **Pre-1.0** while the Effect modules at the centre of the kernel are
   unstable.
5. **Breaking kernel changes ship with migration instructions written for
   agents**, because installed recipes are owned code and never update
   themselves (ADR-0005).

## Consequences

- Projects get a tested combination of Effect versions.
- Upstream breakage reaches the kernel first, where it is absorbed once.
- A project needing a newer Effect waits for a kernel release.
- On 0.x, npm's caret ranges treat a minor bump as breaking (`^0.1.0` does
  not match `0.2.0`), so a breaking kernel change bumps the minor version and
  everything else bumps the patch. The first published version is `0.1.0`.

## Alternatives considered

- **Caret ranges** — unstable modules break in minors; untested combinations.
- **A stable facade over unstable APIs** — conflicts with ADR-0003.
