# ADR-0001: Record architecture decisions

- **Status:** Accepted
- **Date:** 2026-10-25
- **Related:** ADR-0002

## Context

Toolbelt is built mostly by coding agents, which read the repository cold at
the start of every task. A decision that lives only in a conversation is lost
to them, and an outdated description of the project steers them toward the
wrong design. The project was restarted once already for this reason: its
first documents described a Laravel-style framework after the goals had
changed.

## Decision

We will keep Architecture Decision Records in `docs/adr/`, one decision per
file, using [`template.md`](template.md) and the process in
[`README.md`](README.md). ADRs record decisions about Toolbelt itself.
Decisions taken inside a project that uses Toolbelt live in that project's
decision log (ADR-0009), not here.

Specs in `docs/specs/` describe a module's behaviour and public API. They are
written **after** the proof-of-concept slice that builds the module, against
code that compiles, not before it (ADR-0017). `docs/CONTEXT.md` indexes both.

## Consequences

- Agents find the reasons behind the code next to the code.
- Specs can't drift into designs nobody has compiled.
- Some overhead per decision, kept low by keeping ADRs short.

## Alternatives considered

- **Decisions in issues or PR descriptions** — hard to discover, tied to a
  hosting platform.
- **Spec before code** — the previous process. It produced eight ADRs and a
  spec with no code behind them; agents make prototypes cheaper than specs.
