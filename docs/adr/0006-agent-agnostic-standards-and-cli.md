# ADR-0006: Agent-agnostic standards, and the CLI as the universal interface

- **Status:** Accepted
- **Date:** 2026-10-25
- **Related:** ADR-0005, ADR-0015, ADR-0016

## Context

Agents differ in where they read instructions, how they load skills, which
hooks they support and how they ask for permission. Toolbelt must work with
any of them and must stay flexible across projects and clients.

## Decision

1. **Shared standards first:** `AGENTS.md` for instructions, Agent Skills
   (`SKILL.md`) for procedures, MCP for live tools.
2. **The kernel CLI is the universal interface.** Every agent can run a shell
   command, so the logic lives in `toolbelt …` commands; skills and MCP tools
   are thin layers over them. Every command has a non-interactive form and a
   `--json` output.
3. **Tool-specific setup only through adapter commands:**
   `toolbelt agents init --for <tool>` writes, for example, a `CLAUDE.md`
   importing `AGENTS.md`, or tool permission rules. Nothing in the kernel
   depends on a specific agent.
4. **Hard gates use mechanisms every agent goes through:** git hooks and CI,
   not agent-specific hooks.

## Consequences

- Switching agents doesn't change how a project works.
- Agent-specific features (hooks, permission prompts) are optional extras.
- Commands need careful, stable output formats, since agents parse them.

## Alternatives considered

- **Build around one agent** (for example Claude Code plugins) — locks every
  project to one tool.
- **MCP only** — not every agent or environment runs MCP; a CLI always works.
