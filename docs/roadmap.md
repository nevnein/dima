# Roadmap

Back to [CONTEXT](CONTEXT.md).

We start with a **proof of concept in three slices**, each ending with a
checkpoint where we judge its ergonomics before building further
([ADR-0001](adr/0001-record-architecture-decisions.md)). Each slice ends with
a short report — what worked, what was friction, which decisions get revised —
and a spec of what actually worked. Slices may change ADRs; that is what they
are for.

The proof of concept is greenfield: an example app in `examples/poc-app`. If
the ergonomics fail on a new project, adopting an existing one isn't worth
trying.

## Milestone 0 — Foundations

- [x] Git repository and documentation
- [x] Effect v4, pinned exactly in the pnpm catalog
- [x] Decisions recorded (ADR-0001 … ADR-0018)
- [ ] Tooling: TypeScript 7 with `@effect/tsgo`, oxlint, vitest with `@effect/vitest`, PGlite
- [ ] `packages/toolbelt` scaffold, Node CI
- [ ] License (OQ-2)

## Slice 1 — Guardrails

A hand-written example app, no setup or recipes yet.

- [ ] `toolbelt check` (fast by default, `--full`, `--json`, parallel stages, bounded output): type-check with Effect diagnostics, catalogue lint, Squawk, tests, integrity
- [ ] Rule catalogue, rendered for oxlint; first rules: one idiom per concern, no `process.env` outside config, no mutable module-level state, no raw data client outside repositories
- [ ] Escape-hatch format, baseline, `toolbelt review-exceptions`
- [ ] Environment guard and sandbox registry, PGlite
- [ ] Query budget test helper
- [ ] Data-access boundary on handler requirements
- [ ] `pre-commit` and `pre-push` hooks

**Checkpoint:** do the guardrails help agents or get in the way?

## Slice 2 — Setup and recipes

- [ ] Decision schema, project setup (`toolbelt setup --answers`), decision log
- [ ] Decision guides: data storage, adoption mode
- [ ] Installation flow (inspect → plan → apply → prove → record), `AGENTS.md` pointer
- [ ] HTTP + SQL recipe; the slice 1 example rebuilt through installation

**Checkpoint:** does installation really adapt the code, and is the interview worth its time?

## Slice 3 — Authorization, telemetry, verify

- [ ] `CurrentPrincipal`, access declarations, generated authorization tests, development principal
- [ ] Local telemetry sink; `toolbelt dev errors | logs | trace | routes`
- [ ] Minimal `toolbelt verify` (start, health check, authorization tests over HTTP)

**Checkpoint:** does an agent debug faster, and do the generated tests catch what they should?

## After the proof of concept

| Area | What | ADR |
| ---- | ---- | --- |
| Background work | `Job`, schedules, events, workflows, failed-job store, `jobs` commands | [0014](adr/0014-background-work.md) |
| Auth recipes | better-auth, external-jwt/OIDC, existing-session | [0013](adr/0013-authentication-and-authorization.md) |
| Eval | ~10 tasks, two conditions, agent-agnostic harness | [0017](adr/0017-verification-loop-and-evaluation.md) |
| Remaining guides | background work, authentication, API shape, deployment, verification | [0010](adr/0010-decision-guides.md) |
| Remaining `dev` commands and MCP wrapper | `dev config`, `dev db`, `dev sql`, `dev docs` | [0016](adr/0016-local-observability-for-agents.md) |
| Adoption | `toolbelt db introspect`, drift detection, border folder rule, Express/Nest adapter recipe | [0012](adr/0012-adopting-existing-projects.md) |
| Migration skill | MySQL/MariaDB and SQLite → Postgres | [0011](adr/0011-storage-engines-and-framework-state.md) |
| Recipes | CI, deployment (Dockerfile, compose, platform), verify harness, mail and storage adapters | [0005](adr/0005-kernel-recipes-and-agent-knowledge.md), [0018](adr/0018-runtime-deployment-and-scaling.md) |
| Agent adapters | `toolbelt agents init --for <tool>` | [0006](adr/0006-agent-agnostic-standards-and-cli.md) |
| Other linters | ESLint backend for the rule catalogue | [0007](adr/0007-guardrail-model-and-rule-catalogue.md) |

## Later / maybe

Multiple instances (cluster runners on Postgres/MySQL), MCP as part of an
app's API, masked production snapshots into sandboxes, in-app eval for agents,
Bun support, serverless HTTP, personal-data annotations — see
[open questions](open-questions.md).
