# ADR-0016: Local observability for agents

- **Status:** Accepted
- **Date:** 2026-10-25
- **Related:** ADR-0006, ADR-0015, ADR-0017

## Context

An agent debugging a backend needs what a person looks at: the last error,
the logs for a request, the queries that ran, what's mounted. Laravel Boost
and Tidewave expose this through MCP. Effect v4 has `Logger.toFile`,
`ErrorReporter` and `McpServer`, but exports traces only over OTLP HTTP or a
DevTools WebSocket; there is no file exporter.

## Decision

1. **A local telemetry sink in the kernel:** in `local` and `test` only, JSONL
   files for logs, spans (the span tree per request, with SQL queries and
   timings) and errors (full `Cause`, span path, request), with rotation. Built
   from a custom `Tracer`, `Logger.toFile` and `ErrorReporter`. Production is
   unchanged: OTLP export enabled by configuration.
2. **CLI first:** `dima dev errors`, `dev logs --trace <id>`,
   `dev trace <id>`, `dev routes` (with access declarations), `dev config`
   (redacted), `dev db` (schema and migrations), `dev sql` (read-only, sandbox
   or local only), `dev docs <query>` (kernel and Effect docs, read in place).
3. **MCP is a thin wrapper** over the same functions, through `McpServer` over
   stdio.
4. **Tests write the same telemetry,** so a failing test can be debugged from
   its trace.
5. **Later:** an eval inside the running app (like Tidewave's `project_eval`).

## Consequences

- Agents debug from causes and traces, not from assertion messages.
- Telemetry files must be bounded and never written in production.

## Alternatives considered

- **A local OTLP collector or Jaeger** — an extra service to run and query.
- **MCP only** — not every agent runs MCP (ADR-0006).
