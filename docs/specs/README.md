# Specifications

Back to [CONTEXT](../CONTEXT.md).

A spec describes **what** a kernel module or recipe does and **what its public
API looks like**. ADRs explain *why*; specs explain *what*; guides explain *how
to use it*.

Specs are written **after** the proof-of-concept slice that builds the module,
against code that compiles ([ADR-0001](../adr/0001-record-architecture-decisions.md)).
Code examples in a spec must type-check.

## Process

1. Build the module in a slice ([roadmap](../roadmap.md)).
2. Copy [`template.md`](template.md) to `NNNN-module-name.md` with the next
   free number, and describe what was built and what was learned.
3. Status **Implemented** once it matches the shipped code. From then on the
   spec is updated alongside API changes (unlike ADRs, specs are living
   documents).
4. **Superseded** if replaced by a new spec.
5. Add or update the row in [CONTEXT.md](../CONTEXT.md).

## Statuses

`Implemented` (→ `Superseded by SPEC-NNNN`)
