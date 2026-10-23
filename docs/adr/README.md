# Architecture Decision Records

Back to [CONTEXT](../CONTEXT.md).

An ADR captures **one** significant decision about Toolbelt itself: the context
that forced it, what we decided, and what follows from it. ADRs explain *why*
the code looks the way it does long after the discussion is forgotten.
Decisions taken inside a project that uses Toolbelt go in that project's
decision log instead ([ADR-0009](0009-setup-installation-and-decision-log.md)).

## When to write one

Write an ADR when a decision:
- is hard or expensive to reverse,
- affects more than one module, or
- will make someone later ask "why did they do it this way?"

Small, local choices belong in the relevant spec instead.

## Process

1. Copy [`template.md`](template.md) to `NNNN-short-title.md` using the next
   free number (zero-padded to 4 digits).
2. Set status to **Proposed** and open it for discussion.
3. When agreed, set **Accepted** and add the date.
4. Accepted ADRs are **not edited** in substance. To change a decision, write a
   new ADR and mark the old one **Superseded by ADR-NNNN**. Fixing typos and
   links is fine.
5. Add a row to the ADR table in [CONTEXT.md](../CONTEXT.md).

## Statuses

`Proposed` → `Accepted` → (`Deprecated` | `Superseded by ADR-NNNN`)
A proposal can also end as `Rejected` — keep it; rejected ideas are useful history.
