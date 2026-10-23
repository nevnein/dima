# Open questions

Back to [CONTEXT](CONTEXT.md).

Undecided topics and parked ideas. When a question is settled, record the
outcome in an ADR, link it here, and move the entry to **Resolved**.

## Open

### OQ-1 — Final name and npm scope
"Toolbelt" is a placeholder. The kernel is published as one npm package, so
the name must be available on npm, ideally also as a GitHub org. The unscoped
`toolbelt` name is likely taken. Decide before the first publish.

### OQ-2 — License
MIT is the default assumption.

### OQ-3 — To verify while building
Facts a decision depends on that we haven't confirmed yet:
- Better Auth: custom password hash/verify functions (needed to keep existing
  hashes), Kysely adapter support for Postgres, MySQL and SQLite, whether IP
  and user agent can be left unstored, OAuth-provider support for MCP.
- pgloader support for MySQL 8's `caching_sha2_password`.
- MariaDB through `@effect/sql-mysql2`.
- PGlite behaviour under concurrent `SKIP LOCKED` claims, for queue tests.
- Express/Nest adapter for `toWebHandler` output.

## Parked ideas

Not in scope now; worth revisiting.

| Idea | Why parked | Related |
| ---- | ---------- | ------- |
| Personal-data annotations on `Schema` fields, driving log redaction and generated erasure/export tests | Too advanced for the current scope | [ADR-0013](adr/0013-authentication-and-authorization.md) |
| MCP as part of an app's API: curated projection of operations (never one tool per route), same access declarations and generated tests as endpoints, `System` excluded, lethal-trifecta warning in the guide | Deferred until a project needs it; OpenAPI is the agent-readable contract for now | [ADR-0016](adr/0016-local-observability-for-agents.md) |
| Authorization proof values, viewer-scoped collection queries, exhaustive policy map, Postgres row-level security | Waiting for evidence from the proof of concept | ADR-0013 |
| Masked production snapshots into sandboxes | Later feature | [ADR-0015](adr/0015-agent-environment-safety.md) |
| In-app eval for agents (like Tidewave's `project_eval`) | Runs arbitrary code in a live app | ADR-0016 |
| Multiple instances; Bun; serverless HTTP | Not needed yet | [ADR-0018](adr/0018-runtime-deployment-and-scaling.md) |
| NoSQL application data | No Effect drivers | [ADR-0011](adr/0011-storage-engines-and-framework-state.md) |

## Resolved

| Question | Outcome |
| -------- | ------- |
| What Toolbelt is | Guardrails and starting points for agent-built backends — [ADR-0002](adr/0002-vision-and-principles.md) |
| Framework package or templates | Kernel, recipes and agent knowledge — [ADR-0005](adr/0005-kernel-recipes-and-agent-knowledge.md) |
| ORM, relations, query builder | Out of scope; typed SQL plus guardrails — ADR-0002 |
| App structure and discovery | Recipes and setup — [ADR-0009](adr/0009-setup-installation-and-decision-log.md) |
| Tooling | TypeScript 7, `@effect/tsgo`, oxlint — [ADR-0007](adr/0007-guardrail-model-and-rule-catalogue.md) |
| Runtime support | Node only — [ADR-0018](adr/0018-runtime-deployment-and-scaling.md) |
| Auth scope | Kernel authorization, auth as recipes — [ADR-0013](adr/0013-authentication-and-authorization.md) |
| `Application` type | No; the app skeleton is a recipe — ADR-0005 |
| AI-first repository | ADR-0005, [ADR-0006](adr/0006-agent-agnostic-standards-and-cli.md), [ADR-0017](adr/0017-verification-loop-and-evaluation.md) |
