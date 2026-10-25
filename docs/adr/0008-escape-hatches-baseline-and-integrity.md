# ADR-0008: Escape hatches, baseline and integrity check

- **Status:** Accepted
- **Date:** 2026-10-25
- **Related:** ADR-0007, ADR-0012, ADR-0013

## Context

A guardrail with no escape gets deleted; an escape that is silent is useless.
Agents facing an error tend to weaken the rule rather than fix the code.
Existing projects can't fix every existing violation before adopting.

## Decision

1. **Escape hatches are declared in a fixed format**, one of the rare places
   where comments are required:

   ```ts
   // dima-allow <rule-id> <reason>: <explanation>
   ```

   Allowed reasons: `legacy` (existing code, not yet migrated), `external` (a
   third-party API or schema forces it), `measured` (a performance need, citing
   the measurement), `migration-step` (one step of a staged schema change),
   `false-positive` (the rule is wrong here; report it).
2. **Tool-native suppressions** (`eslint-disable`,
   `@effect-diagnostics-next-line`, `squawk-ignore`) without an adjacent
   `dima-allow` fail the integrity check.
3. **Some rules can't be suppressed at all:** the environment guard and
   authorization. Authorization's only escape is the runtime
   `Policy.asSystem(reason)` (ADR-0013).
4. **`dima review-exceptions`** lists every escape and `asSystem` call
   site, so an agent can judge each one (justified? safer way? notify the
   user?). Security-related exceptions are always reported to the user.
5. **A baseline file** records existing violations; checks fail only on new
   ones. Baseline entries count as `legacy` exceptions.
6. **The integrity check** verifies that rule presets are referenced, severities
   aren't lowered, the `AGENTS.md` pointer exists (ADR-0005), and reports
   suppression counts and catalogue coverage.

## Consequences

- Weakening a guardrail shows up as a failure, not a quiet diff.
- Escapes are auditable by search.
- An agent can still bypass everything in a project it controls; the checks
  make that visible, not impossible.

## Alternatives considered

- **Free-form suppressions** — unreviewable.
- **No suppressions** — guardrails get removed instead.
- **Agent-specific hooks blocking config edits** — not agent-agnostic
  (ADR-0006); can be added through adapters.
