# ADR-0003: Build on Effect v4 — constrain it, don't wrap it

- **Status:** Accepted
- **Date:** 2026-10-25
- **Related:** ADR-0002, ADR-0004, ADR-0007

## Context

The guardrails Toolbelt needs (typed errors, tracked dependencies, resource
safety, tracing, test layers) are what Effect provides. Effect v4 also ships
HTTP APIs, SQL, CLI, persistence, cluster, workflow, AI/MCP and observability
modules (see [effect-landscape.md](../effect-landscape.md)).

Effect also offers several ways to do the same thing: 4 ways to define a
service, 4 ways to define an error, about 8 layer constructors. Agents
choosing freely among them produce inconsistent code.

## Decision

1. We build on **Effect v4** and expose Effect types directly. Users and agents
   write plain Effect code.
2. Toolbelt **narrows** Effect to **one idiom per concern**, enforced by Effect
   diagnostics and the rule catalogue (ADR-0007), and documented in a short
   "use X, never Y" table in the kernel's `AGENTS.md`.
3. Toolbelt **never wraps** Effect behind its own API. Narrowing happens
   through types, diagnostics and lint, not through a parallel surface.
4. There is **no Module type, no service container, no string-keyed lookup**.
   Functionality is plain services and layers. Where a registry is needed, it
   follows the `HttpRouter.use` pattern: a registry service plus layers that
   add to it.

## Consequences

- What is learned in Toolbelt transfers to Effect and back.
- Missing dependencies are compile-time errors (unsatisfied `R`).
- The narrowing must be maintained as Effect evolves; it lives in the kernel,
  so it updates centrally.
- Effect v4 kept v3's core model; agents slipping into v3 habits mostly produce
  wrong imports and renamed APIs, which the `outdatedApi` diagnostic catches.

## Alternatives considered

- **Wrap Effect behind our own API** — doubles the surface, isolates the code
  from the Effect ecosystem.
- **Use Effect unconstrained** — every idiom allowed; agents mix them.
- **A Module abstraction on top of layers** — a parallel concept that Effect
  libraries don't speak; layers already do the job.
