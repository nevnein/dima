# ADR-0018: Runtime, deployment and scaling

- **Status:** Accepted
- **Date:** 2026-10-25
- **Related:** ADR-0011, ADR-0012, ADR-0014

## Context

Toolbelt is for personal use: supporting two runtimes doubles CI and driver
choices for little gain. Background work (ADR-0014) needs long-running
processes. Scaling to many instances is rarely needed early, but is expensive
to retrofit if the code assumes one instance.

## Decision

1. **Node only.** Bun is a nice-to-have. The kernel stays platform-agnostic (no
   `node:*` or `Bun.*` imports in the kernel), so adding Bun later stays cheap.
2. **Containers are the deploy unit.** Serverless and edge are deferred; if
   ever considered, only HTTP would move, since jobs, schedules and workflows
   need a long-running process.
3. **HTTP is exposed as a web-standard handler** (Request → Response, through
   `toWebHandler`). Catalogue rules ban `process.env` outside the configuration
   layer and mutable module-level state.
4. **Deployment is a set of recipes** (Dockerfile, compose for local services,
   platform configuration), chosen through the deployment guide.
5. **One instance first; the kernel stays tier-agnostic.** No in-process state
   is needed for correctness (an in-memory cache only as an optimization; rate
   limiter and cache on SQL when more than one instance is possible), jobs are
   idempotent, cron and workflows go through `ClusterCron` and the workflow
   engine, sessions live in the database.
6. `toolbelt check` **fails** when the deployment guide records more than one
   instance alongside in-memory drivers or SQLite framework state.
7. **Later, multiple instances:** multiple runners on Postgres or MySQL (not
   SQLite), with a multi-instance CI test added only then.

## Consequences

- Going to multiple instances later is a layer change, not a rewrite.
- Bun users get no guarantee until Bun support is added.

## Alternatives considered

- **Node and Bun first-class** — two CI matrices and driver sets.
- **Separate processes per role by default** — more moving parts for a single
  instance.
- **Serverless first** — doesn't fit long-running background work.
