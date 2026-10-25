# Dima — Context

> **Start here.** This file is the index of the project's documentation and the
> shortest path to understanding what we are building, why, and where things
> stand. Keep it current: if you add a doc, link it here.

Dima is Italian for a jig: a fixture that guides the tool so every cut is
repeatable and safe ([ADR-0019](adr/0019-name-and-package.md)).

## What is this?

A set of **guardrails and starting points that let coding agents build
backends fast and safely**, built on [Effect](https://effect.website) v4.

Writing code is rarely the hard part any more. The hard parts are keeping
agent-written code safe and reviewable, adapting it to an existing context,
and choosing the right paradigm and infrastructure. Dima ships three
things for that ([ADR-0005](adr/0005-kernel-recipes-and-agent-knowledge.md)):

- a **kernel** on npm that enforces the invariants agents must not break, and
  updates across projects;
- **recipes**: advanced starting points, installed into a project through a
  setup process, adapted, then owned by the project;
- **agent knowledge**: decision guides and docs that ship inside the kernel.

It is a personal toolkit, not a market product
([ADR-0002](adr/0002-vision-and-principles.md)).

## Principles

From purpose to means ([ADR-0002](adr/0002-vision-and-principles.md)):

1. **Safe by default.** Writes go only to sandboxes, production is reachable
   only through the pipeline, nothing is pushed by default.
2. **Guardrails over generators.** What agents must not get wrong is enforced,
   never just documented. Every escape is declared and reviewed.
3. **Prove it works.** `dima check` and `dima verify`. Done means
   evidence.
4. **Adapt to the context.** Detect, ask what can't be detected, adopt existing
   conventions. Decisions are data, logged, with who may take them.
5. **An invariant kernel, owned recipes.**
6. **Visible to agents.** Errors, traces, logs and routes readable locally
   through the CLI.
7. **Agent-agnostic.** `AGENTS.md`, Agent Skills, MCP and a CLI; tool-specific
   setup only through adapters.
8. **Use Effect, constrain it, don't wrap it.**
9. **Start small, stay honest about stability.**

## Status

| Area | State |
| ---- | ----- |
| Repository | pnpm workspace, tooling in place (TypeScript 7 + Effect diagnostics, oxlint, vitest, PGlite, CI); `packages/dima` scaffolded, no modules yet |
| Effect | v4 surveyed at `4.0.6` ([landscape](effect-landscape.md)) |
| Decisions | 19 ADRs accepted (2026-10-25) |
| Next | Slice 1 — guardrails, see [roadmap](roadmap.md) |

## Documentation map

| Path | What lives there |
| ---- | ---------------- |
| [`../AGENTS.md`](../AGENTS.md) | Instructions for coding agents (`CLAUDE.md` imports it). |
| [`CONTEXT.md`](CONTEXT.md) | This index. Vision, principles, status, map. |
| [`effect-landscape.md`](effect-landscape.md) | What Effect v4 provides, its stability levels, the idioms we use, and what the kernel adds. |
| [`roadmap.md`](roadmap.md) | Proof-of-concept slices and what comes after. |
| [`glossary.md`](glossary.md) | Shared vocabulary. |
| [`open-questions.md`](open-questions.md) | Undecided topics and parked ideas. |
| [`adr/`](adr/README.md) | **Architecture Decision Records** — *why* we chose what we chose. |
| [`specs/`](specs/README.md) | **Specifications** — *what* a module does, written after the slice that builds it. |
| [`guides/`](guides/README.md) | **Guides** — how to use Dima. Written once APIs settle. |

### Architecture Decision Records

| #    | Title | Status |
| ---- | ----- | ------ |
| [0001](adr/0001-record-architecture-decisions.md) | Record architecture decisions | Accepted |
| [0002](adr/0002-vision-and-principles.md) | Vision and principles | Accepted |
| [0003](adr/0003-build-on-effect-constrain-dont-wrap.md) | Build on Effect v4 — constrain it, don't wrap it | Accepted |
| [0004](adr/0004-effect-version-pinning-and-stability.md) | Effect version pinning and stability | Accepted |
| [0005](adr/0005-kernel-recipes-and-agent-knowledge.md) | Kernel, recipes and agent knowledge | Accepted |
| [0006](adr/0006-agent-agnostic-standards-and-cli.md) | Agent-agnostic standards, and the CLI as the universal interface | Accepted |
| [0007](adr/0007-guardrail-model-and-rule-catalogue.md) | Guardrail model and rule catalogue | Accepted |
| [0008](adr/0008-escape-hatches-baseline-and-integrity.md) | Escape hatches, baseline and integrity check | Accepted |
| [0009](adr/0009-setup-installation-and-decision-log.md) | Setup, recipe installation and the decision log | Accepted |
| [0010](adr/0010-decision-guides.md) | Decision guides | Accepted |
| [0011](adr/0011-storage-engines-and-framework-state.md) | Storage engines and framework state | Accepted |
| [0012](adr/0012-adopting-existing-projects.md) | Adopting existing projects | Accepted |
| [0013](adr/0013-authentication-and-authorization.md) | Authentication and authorization | Accepted |
| [0014](adr/0014-background-work.md) | Background work | Accepted |
| [0015](adr/0015-agent-environment-safety.md) | Agent environment safety | Accepted |
| [0016](adr/0016-local-observability-for-agents.md) | Local observability for agents | Accepted |
| [0017](adr/0017-verification-loop-and-evaluation.md) | Verification loop and evaluation | Accepted |
| [0018](adr/0018-runtime-deployment-and-scaling.md) | Runtime, deployment and scaling | Accepted |
| [0019](adr/0019-name-and-package.md) | Name the project Dima, published as `@nevnein/dima` | Accepted |

### Specifications

None yet. Specs are written after each proof-of-concept slice
([ADR-0001](adr/0001-record-architecture-decisions.md)).

## How we work

- **Check Effect first.** Before building anything, look it up in
  [effect-landscape.md](effect-landscape.md) and the installed Effect source.
- **Decide, then record.** Non-trivial choices about Dima get an ADR
  ([how](adr/README.md)).
- **Code, then spec.** A module is built in a proof-of-concept slice; its spec
  describes what actually worked.
- **Follow our own guardrails.** This repo is held to the same definition of
  done it ships ([ADR-0017](adr/0017-verification-loop-and-evaluation.md)).
- **Open questions are fine.** Write them in
  [open-questions.md](open-questions.md) instead of guessing silently.
- **Re-survey on upgrade.** Every Effect upgrade re-checks the landscape doc.
- **Keep this index current.** Every new ADR or spec gets a row above.
