# ADR-0011: Storage engines and framework state

- **Status:** Accepted
- **Date:** 2026-10-25
- **Related:** ADR-0007, ADR-0012, ADR-0014, ADR-0015

## Context

New projects can choose their database; existing ones bring theirs. Effect
4.0.6 ships SQL drivers for Postgres, MySQL, MSSQL, SQLite (Node, Bun),
libSQL, D1 and ClickHouse, and its cluster, workflow and persistence storage
has code paths for pg, mysql, mssql and sqlite. Effect has no NoSQL drivers.

Framework state (queues, workflow journal, cron state, cache, rate limits,
failed jobs) has different needs from the application's domain data.
Keeping both in one database makes enqueueing a job atomic with the domain
write.

## Decision

1. **Supported engines:** Postgres, SQLite, MySQL/MariaDB (MariaDB through
   `mysql2`).
2. **Two stores:** *application data* (owned by the project, any supported
   engine) and *framework state* (the kernel's infrastructure).
3. **Framework state lives in the application database** when it's Postgres or
   MySQL. Otherwise it falls back to **SQLite, single instance only**,
   documented as a hard limit.
4. **New projects default to Postgres** for both.
5. **Guardrails are dialect-aware:** the data-access boundary takes a list of
   raw data clients; migration lint is pluggable per dialect (Squawk for
   Postgres); tests run on the same engine as production, in-process where
   possible (PGlite, SQLite), in a sandbox container otherwise; the integrity
   check reports guardrail coverage per store.
6. **Postgres limits are documented** in the storage guide: bloat from long
   transactions, short claim transactions, and a throughput range per tier
   beyond which a dedicated queue is suggested. Effect's SQL queue polls and
   claims with `FOR UPDATE SKIP LOCKED`; it doesn't use `LISTEN/NOTIFY`.
7. **A migration skill (later)** moves MySQL/MariaDB or SQLite databases to
   Postgres in five phases: assess (read-only), rehearse on a sandbox copy,
   verify (counts, checksums, foreign keys, samples, test suite), adapt
   queries, human-gated cutover. It covers collations, zero dates, unsigned
   types, `sql_mode` history, time zones, `ON UPDATE` columns, SQLite typing
   and orphaned rows.

## Consequences

- Existing MySQL projects keep atomic enqueueing.
- SQLite projects can't scale to multiple instances without moving framework
  state.
- Every guardrail touching the database needs a per-dialect story, or an
  explicit "not covered" in the coverage report.

## Alternatives considered

- **Postgres only** — cuts off existing projects.
- **NoSQL support now** — no Effect drivers; deferred.
- **SQLite in development, Postgres in production** — the original plan. It
  can't exercise locking and queue semantics, and PGlite removes the reason
  for the gap.
