# ADR-0015: Agent environment safety

- **Status:** Accepted
- **Date:** 2026-10-25
- **Related:** ADR-0006, ADR-0008, ADR-0011, ADR-0016

## Context

In July 2025 a Replit agent deleted a production database during a code
freeze, and a prompt hidden in a support ticket made an agent with full
Supabase access copy a private tokens table into public view. Instructions
aren't controls; anything a guard reads, an agent with a shell can also
produce.

## Decision

1. **Threat model, stated explicitly:** guards are seatbelts against
   accidents. The real boundary is **credentials that aren't present**.
2. **Production is reachable only through the deployment pipeline.** No
   production credentials in development or agent environments. Production
   migrations run in the pipeline at deploy time, gated by approvals outside
   the agent's control. Setup records the pipeline and warns if there is none.
3. **Sandbox rule:** agents write to or create databases only in throwaway
   instances the toolchain created. `toolbelt sandbox up` records each instance
   in a local registry; PGlite and SQLite instances are recognized directly.
   Writing CLI commands (migrate, seed, reset, drop, create database) run only
   on registered instances or on `localhost` with `APP_ENV` `local`/`test`,
   and can't be overridden. The running production app is unaffected.
4. **In-process engines first;** containers only when unavoidable (MySQL),
   started through the narrow `toolbelt sandbox` command, never by giving the
   agent the Docker socket, which is root-equivalent on the host.
5. **Agents never connect to production**, not even read-only. Real data for
   debugging comes later, as a masked snapshot loaded into a sandbox.
6. **Secrets:** the development `.env` holds only sandbox credentials;
   `Config.Redacted` keeps secrets out of logs.
7. **Never push by default:** a `pre-push` git hook refuses pushes outside an
   interactive terminal, plus an adapter rule per tool. The guide recommends
   that pushes deploy to preview or staging at most and that production always
   needs manual approval.
8. Tool-specific permissions (for example, not reading `.env*`) are generated
   optionally by `toolbelt agents init --for <tool>`.

## Consequences

- An agent can't damage production by accident from a development machine.
- Projects without a pipeline get a warning, not protection.
- The seatbelts can be bypassed deliberately (`--no-verify`); that is accepted.

## Alternatives considered

- **Confirmation prompts and tokens the agent can't mint** — any value a
  local process reads, an agent can produce; the pipeline's approval channel
  already provides this.
- **Read-only production access for debugging** — the lethal trifecta: private
  data, untrusted content, and an agent with network access.
