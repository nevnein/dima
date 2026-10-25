# Effect v4 landscape

Back to [CONTEXT](CONTEXT.md).

What Effect already provides, what Dima adds on top, and the facts we
verified in the installed source. This is the reference for "is this already
in Effect?" — check it before building anything.

- **Surveyed:** `effect@4.0.6` (2026-10-25). Re-check on every Effect upgrade
  ([ADR-0004](adr/0004-effect-version-pinning-and-stability.md)).
- **Primary sources:** the installed package — `node_modules/effect/AGENTS.md`
  (how to write v4 code), `node_modules/effect/ai-docs/src/` (runnable
  examples by topic), `node_modules/effect/src/` (signatures and `@stability`
  labels) — and the
  [migration guide](https://github.com/Effect-TS/effect/blob/main/MIGRATION.md).

## Package layout (v4)

In v4 most former `@effect/*` packages were merged into `effect` as subpath
modules. Only packages carrying a third-party or runtime dependency stay
separate, and **all share one version number** with `effect`.

| Import | Contents |
| ------ | -------- |
| `effect` | Core: `Effect`, `Layer`, `Context`, `Schema`, `Config`, `ConfigProvider`, `Scope`, `Schedule`, `Cron`, `Cache`, `PubSub`, `Queue`, `Stream`, `Logger`, `Metric`, `Tracer`, `FileSystem`, `Path`, `ManagedRuntime`, … |
| `effect/http` | `HttpRouter`, `HttpServer`, `HttpMiddleware`, `HttpClient`, `HttpStaticServer`, … |
| `effect/http-api` | Schema-first APIs: `HttpApi`, `HttpApiGroup`, `HttpApiEndpoint`, `HttpApiBuilder`, `HttpApiMiddleware`, `HttpApiSecurity`, `HttpApiClient`, `HttpApiTest`, OpenAPI, Scalar |
| `effect/sql` | `SqlClient`, `Migrator`, `SqlModel`, `SqlSchema`, `SqlResolver` |
| `effect/schema` | `Model` (one model definition with select/insert/update/JSON variants) |
| `effect/cli` | `Command`, `Flag`, `Argument`, `Prompt` |
| `effect/rpc` | `Rpc`, `RpcGroup`, `RpcServer`, `RpcClient`, `RpcTest` |
| `effect/cluster` | Sharded entities, `Singleton`, `ClusterCron`, `SingleRunner`, SQL/socket/HTTP runners |
| `effect/workflow` | Durable workflows: `Workflow`, `Activity`, `DurableClock`, `DurableDeferred`, `DurableQueue` |
| `effect/persistence` | `KeyValueStore`, `PersistedQueue`, `PersistedCache`, `RateLimiter`, `Redis` |
| `effect/observability` | OTLP (traces, logs, metrics), Prometheus |
| `effect/ai` | `McpServer`, `McpClient`, `Tool`, `Toolkit`, language-model clients |
| `effect/testing` | `TestClock`, `TestConsole`, … |
| Also | `effect/devtools`, `effect/workers`, `effect/process`, `effect/socket`, `effect/net`, `effect/encoding`, `effect/eventlog`, `effect/reactivity`, `effect/graphql` |
| `@effect/platform-node` | Node adapter: `NodeRuntime.runMain`, HTTP server, filesystem, cluster sockets |
| `@effect/sql-pg`, `@effect/sql-mysql2`, `@effect/sql-sqlite-node`, … | SQL drivers (see below) |
| `@effect/vitest`, `@effect/opentelemetry` | Testing, full OpenTelemetry SDK integration |
| `@effect/tsgo`, `@effect/language-service` | Effect diagnostics for TypeScript 7 (tsgo) and TypeScript 5 (tsc plugin) |

## Stability

Every module declares a stability level:

- **stable** (or untagged) — strict semver.
- **unstable** — may break in **minor** releases. This covers nearly all subpath
  modules above (`http-api`, `sql`, `persistence`, `cluster`, `workflow`,
  `ai`, `devtools`, …) and every API that exposes a third-party dependency.
- **experimental** — may break in patch releases.

Moving to `effect/*` did **not** stabilize a module. Our response is
[ADR-0004](adr/0004-effect-version-pinning-and-stability.md).

## Idioms we use

One idiom per concern ([ADR-0003](adr/0003-build-on-effect-constrain-dont-wrap.md)),
enforced by Effect diagnostics and the rule catalogue.

| Concern | Use | Never |
| ------- | --- | ----- |
| Define a service | `class X extends Context.Service<X, Shape>()("pkg/path/X")` with a `static readonly layer` | `Context.Tag`, `Effect.Service`, the function form |
| Implement methods | `Effect.fn("X.method")(function*(…) { … })` — named span for free | plain arrow functions, `async` functions |
| Errors | `Schema.TaggedError`, raised with `return yield* new E(…)` | `Data.TaggedError`, global `Error`, `try/catch` inside `Effect.gen` |
| Config | `Config.String("KEY")`, `Config.Redacted`, `Config.Port`, read inside layers | `process.env` |
| `.env` | `ConfigProvider.fromDotEnv()` in local and test | — |
| Build layers | `Layer.effect` for services, `Layer.unwrap` for config-driven ones | other constructors without a reason |
| Wire dependencies | `Layer.provide` / `Layer.provideMerge` inside the service's module | everything wired in `main` |
| Register into a shared service | A layer that adds to a registry service, e.g. `HttpRouter.use(router => router.add(…))` | — |
| Run an app | `Layer.launch(AppLayer)` + `NodeRuntime.runMain` | manual signal handling |
| Embed in non-Effect code | `ManagedRuntime.make(AppLayer)`, or `HttpRouter.toWebHandler` for HTTP | `Runtime<R>` (removed) |
| Dates, randomness, HTTP | `DateTime`, `Random`, `HttpClient` through the kernel client | `Date`, `crypto.randomUUID`, global `fetch` |

## Verified facts (4.0.6)

Checked in the installed source or on npm; each one shaped a decision.

| Fact | Where | Used by |
| ---- | ----- | ------- |
| SQL drivers at 4.0.6: `sql-pg`, `sql-mysql2`, `sql-mssql`, `sql-sqlite-node`, `sql-sqlite-bun`, `sql-libsql`, `sql-d1`, `sql-clickhouse`, `sql-pglite` (PGlite as a `SqlClient`, so in-process Postgres tests need no socket shim). No v4 `sql-kysely` or `sql-drizzle` | npm | [ADR-0011](adr/0011-storage-engines-and-framework-state.md) |
| Cluster, workflow and persistence storage have code paths for pg, mysql, mssql and sqlite | `cluster/SqlMessageStorage.ts` | ADR-0011 |
| `PersistedQueue` (SQL) polls (default 1 s, plus an in-process nudge) and claims with `FOR UPDATE SKIP LOCKED`; no `LISTEN/NOTIFY`. It supports delay, retry schedule, max attempts (default 10) and dedupe by id | `persistence/PersistedQueue.ts` | [ADR-0014](adr/0014-background-work.md) |
| `Cron` supports time zones (`tz`) | `Cron.ts` | ADR-0014 |
| `Workflow.make` requires an idempotency key; workflows run in one process with `SingleRunner` + `ClusterWorkflowEngine`; there is no versioning for in-flight instances | `workflow/`, `cluster/` | ADR-0014 |
| `HttpApiMiddleware` declares `provides`, removing those services from handlers' requirements | `http-api/HttpApiMiddleware.ts` | [ADR-0013](adr/0013-authentication-and-authorization.md) |
| `HttpApiBuilder.group` exposes the handlers' requirements in the returned layer's `RIn` | `http-api/HttpApiBuilder.ts` | [ADR-0007](adr/0007-guardrail-model-and-rule-catalogue.md) |
| `HttpRouter.toWebHandler` returns a Request → Response handler | `http/HttpRouter.ts` | [ADR-0012](adr/0012-adopting-existing-projects.md), [ADR-0018](adr/0018-runtime-deployment-and-scaling.md) |
| No database introspection or schema-from-database tooling | `sql/` | ADR-0012 |
| `Logger.toFile`, `ErrorReporter` exist; traces export only over OTLP HTTP or the DevTools WebSocket; no file exporter | `Logger.ts`, `ErrorReporter.ts`, `observability/` | [ADR-0016](adr/0016-local-observability-for-agents.md) |
| `McpServer` over stdio and HTTP | `ai/McpServer.ts` | ADR-0016 |
| `@effect/tsgo` targets TypeScript 7 and Effect v4; `@effect/language-service` has a CLI `diagnostics` command; diagnostics include `floatingEffect`, `missingReturnYieldStar`, `leakingRequirements`, `outdatedApi`, `asyncFunction`, `globalFetch` | npm, READMEs | ADR-0007 |
| Many catalogue rules already exist as Effect diagnostics: `processEnv`, `globalDate`, `globalFetch`, `globalRandom`, `globalTimers`, `globalConsole`, `asyncFunction`, `newPromise`, `preferSchemaTaggedError`, `extendsNativeError` (each with an `…InEffect` variant where relevant). Off by default but enabled here: `apiStabilityLeak`, `deterministicKeys`, `effectDoNotation`, `nodeBuiltinImport`, `strictEffectProvide`, and `preferSchemaOverJson` (inside Effect code only). With `effect-tsgo patch`, all fail `tsc` like type errors; `@ts-ignore` would hide them, so oxlint bans TypeScript suppression comments | `@effect/tsgo` README, probed 2026-10-25 | ADR-0007 |
| No official Effect docs MCP for v4 and no `llms.txt` on effect.website; the package's `AGENTS.md` and `ai-docs` are the official agent surface | web, 2026-10-24 | [ADR-0005](adr/0005-kernel-recipes-and-agent-knowledge.md) |

## What Dima adds

| Concern | Effect provides | Kernel adds | Recipes provide |
| ------- | --------------- | ----------- | --------------- |
| Guardrails | Types, diagnostics | Rule catalogue, `dima check`, integrity, escape hatches, baseline | — |
| HTTP | `HttpApi`, `HttpRouter` | Access declarations, generated authorization tests, data-access boundary | API structure, handlers |
| Data | `effect/sql`, `Migrator`, drivers | Query budget, migration lint, sandbox registry, environment guard; later introspection and drift | SQL setup, migrations, repositories |
| Auth | `HttpApiMiddleware`, `HttpApiSecurity` | `CurrentPrincipal`, `Policy`, `asSystem` | better-auth, external-jwt/OIDC, existing-session |
| Background work | `PersistedQueue`, `ClusterCron`, `effect/workflow` | `Job`, schedules, events, failed-job store, `jobs` commands, duplicate-run tests | — |
| Observability | `Logger`, `Tracer`, OTLP, `ErrorReporter` | Local telemetry sink, `dima dev …` commands, MCP wrapper | — |
| Setup | `effect/cli` | Decision schema, decision guides, setup, installation flow | — |
| Mail, storage | `FileSystem` (local) | Contracts and test fakes | Provider adapters (SMTP, Resend, S3, …) |
| Deployment, CI, verification | — | `dima verify` contract | Dockerfile, CI, verify harness |
