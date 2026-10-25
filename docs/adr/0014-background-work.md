# ADR-0014: Background work

- **Status:** Accepted
- **Date:** 2026-10-25
- **Related:** ADR-0011, ADR-0018

## Context

Durable execution (DBOS, Vercel Workflows, Cloudflare Workflows) is absorbing
queues, retries, cron and sagas into one model. Effect v4 has the pieces:
`PersistedQueue` (SQL, at-least-once, delay, retry schedule, max attempts,
dedupe by id, polling with `FOR UPDATE SKIP LOCKED`), `ClusterCron` (catch-up
without overlap, time zones via `Cron`), and `effect/workflow` (mandatory
idempotency keys, activities, durable clock and signals, compensation),
runnable in one process with `SingleRunner`. All of it is unstable, and
workflows have no versioning for in-flight instances yet.

## Decision

1. **One model: everything is `execute(key, effect)`.**

   | Concept | Built on | Mandatory |
   | --- | --- | --- |
   | Job | `Job.define({ name, payload, key, retry, handler })` on `PersistedQueue` (SQL) | idempotency key, retry `Schedule` |
   | Schedule | cron that enqueues a job keyed by the scheduled time | catch-up policy (`skip` / `once` / `all`), time zone |
   | Event listener | publishing enqueues one job per listener, keyed by event id | — |
   | Workflow | opt-in, `effect/workflow` + `SingleRunner` | version in the name (`Name/v2`), drain before removal |

2. **Everything lives in the kernel**, including a failed-job store,
   `dima jobs failed|retry`, per-job concurrency limits, cleanup of old
   executions, `pollInterval` per job (default 1 second), and `TestClock`
   helpers. It updates centrally as Effect's workflow modules mature.
3. **Duplicate-run tests:** each job is run twice with the same key in tests;
   side effects must happen once.
4. **One process by default** runs HTTP, jobs and schedules; subcommands split
   them on demand.
5. **No workflow lock file:** we rely on upstream improving versioning.
6. **DBOS** is a fallback only if a project needs durable execution that
   `effect/workflow` can't handle yet.

## Consequences

- At-least-once delivery is safe by construction.
- With framework state in the application database, enqueueing is atomic with
  domain writes; no outbox needed.
- The kernel carries unstable Effect dependencies and absorbs their changes.

## Alternatives considered

- **Separate queue, scheduler and events modules** — the original plan; two
  retry and failure models once workflows arrive.
- **Workflows for everything now** — no versioning, journaling overhead for
  simple jobs.
- **An external engine (DBOS, Restate, Temporal)** — not Effect-native, or an
  extra server.
