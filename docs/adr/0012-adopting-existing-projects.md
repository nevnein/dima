# ADR-0012: Adopting existing projects

- **Status:** Accepted
- **Date:** 2026-10-25
- **Related:** ADR-0008, ADR-0009, ADR-0011

## Context

Most real work starts from something that already exists: a database, an
app, conventions, deployment. In practice there is usually a clear cutoff:
the old system stops releasing and new work happens in the new one, either on
the shared database or on a new one.

## Decision

1. **Three adoption modes:** *new* (from scratch), *alongside* (a separate
   Dima process sharing the existing database), *embedded* (Dima code
   mounted inside an existing app). New and alongside are the main paths.
   Embedded mounts through `HttpRouter.toWebHandler` in Hono, Next.js and Bun;
   Express and Nest go through an adapter recipe.
2. **Dima owns only its own code.** `dima check` is scoped to the
   Dima subtree; the baseline applies within that scope.
3. **The border:** outgoing calls into the old system go only through *border
   adapters*: Effect services that turn failures into `Schema.TaggedError` and
   decode results with `Schema`. A catalogue rule bans imports outside the
   subtree except from the border folder. Incoming calls use only
   `toWebHandler` or `ManagedRuntime`. Adapters get every guardrail.
4. **Migration ownership:**
   - *embedded* — the existing migration tool stays the owner; Dima reads
     the schema and lints the tool's SQL where it can be produced;
   - *alongside* — the old system makes no new migrations. Its migrations are
     squashed into one baseline migration from a schema-only dump, recorded as
     already applied in the existing database, and skipped by migration lint.
5. **Clear cutoff by default.** Dima adopts the existing conventions (no
   prefixes; framework-state tables named the project's way, with a collision
   check only). Redirecting conventions is decided per project during setup:
   gradual automatic migration only in clean cases, otherwise the user decides.
   A redirect is carried through to the end, leaving no compatibility views or
   aliases. There is no check that the cutoff holds.
6. **When no cutoff is possible:** namespaced framework state, table ownership
   recorded in the decision log, and a check that fails when Dima's
   migrations touch tables it doesn't own (unless declared `external`).
7. **Setup records the existing context:** stack, conventions (naming, error
   format, API style), deployment and mode. Recipes read it when adapting.
8. **Later:** `dima db introspect` (Schema and Model files plus naming
   conventions from an existing database) and schema drift detection in
   `dima check`.

## Consequences

- Adoption doesn't require cleaning the old code first.
- Border adapters make the trust boundary explicit and typed.
- Introspection is a kernel feature to build; Effect has none.

## Alternatives considered

- **Greenfield only** — misses most real work.
- **Prefixing and namespacing by default** — leaves traces in a project that
  is moving to Dima anyway.
- **Dima's migrator taking over in embedded mode** — two migration tools on
  one database.
