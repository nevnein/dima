# Dima

> Italian for a jig: a fixture that guides the tool so every cut is
> repeatable and safe. Published as `@nevnein/dima`.

Guardrails and starting points that let coding agents build TypeScript
backends fast and safely, built on [Effect](https://effect.website) v4.

- **A kernel** on npm enforces what agents must not get wrong: Effect
  diagnostics, a rule catalogue, migration lint, generated authorization tests,
  sandboxed database writes, and one `dima check` command.
- **Recipes** are advanced starting points, installed into a project through a
  setup process that adapts them to its context, then owned by the project.
- **Decision guides** help agents choose the right paradigm and infrastructure,
  and say which decisions need a human.

**Status:** foundations in place (decisions, tooling, CI); the first kernel
modules come with slice 1 of the [roadmap](docs/roadmap.md).

Start with [`docs/CONTEXT.md`](docs/CONTEXT.md).
