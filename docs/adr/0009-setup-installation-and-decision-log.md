# ADR-0009: Setup, recipe installation and the decision log

- **Status:** Accepted
- **Date:** 2026-10-25
- **Related:** ADR-0005, ADR-0010, ADR-0012

## Context

Copying a recipe blindly into a project doesn't adapt it. pstack's
`setup-pstack` and `create-verification-skill` show a better pattern: inspect
the project, ask only what can't be observed, generate grounded content, and
prove it before handing it over. Decisions taken along the way are context the
next agent needs.

## Decision

1. **The kernel CLI owns the decision schema:** what can be asked, allowed
   values, validation and auto-detection. An agent drives the interview through
   a skill and passes the answers to `dima setup --answers <file>`; a human
   can run the same CLI interactively. Reruns overwrite and converge.
2. **Two levels.** *Project setup* runs once and can be rerun (database,
   runtime, deployment, adoption mode, conventions, agent adapters).
   *Recipe installation* happens per recipe, reads the project's decisions and
   asks only recipe-specific questions.
3. **Installation flow:** **inspect** (detect what the recipe needs) → **plan**
   (files, dependencies, env vars, decisions; nothing written) → **apply** (the
   CLI does the mechanical part; the agent follows the recipe's `INSTALL.md`
   for the judgment part) → **prove** (the recipe's shipped tests, then
   `dima check`) → **record**.
4. **Recipe layout:**

   ```
   recipes/<name>/
     recipe.json   requirements, questions, files, dependencies, env vars, verify commands
     files/        the code
     INSTALL.md    adaptation instructions for the agent
     tests/        shipped tests, run in the prove step
   ```

5. **The decision log** is one structured file in the project. Each entry has
   the decision, its value, the prose reason, the date and who took it. The CLI
   and recipes read it; agents read it as context. It records what was
   installed and from which kernel version, not to sync recipes but to explain
   them.
6. When a project decision changes later, the log records it, and recipes
   installed under the old decision are flagged, not changed.

## Consequences

- Installation is deterministic where it can be and judged where it must be.
- A recipe that hasn't passed its tests is a draft, not installed.
- The decision schema becomes a maintained kernel API.

## Alternatives considered

- **Copy-paste by the agent** — no adaptation contract, no proof.
- **A shadcn-style registry CLI** — mechanically fits, but UI-centric; the
  manifest keeps this option open.
- **Markdown-only decision log** — readable but not usable by tools.
