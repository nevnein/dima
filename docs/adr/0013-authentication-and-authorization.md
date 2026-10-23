# ADR-0013: Authentication and authorization

- **Status:** Accepted
- **Date:** 2026-10-25
- **Related:** ADR-0008, ADR-0011, ADR-0012

## Context

Authorization is where both humans and agents fail: insecure direct object
references (IDOR) live in the endpoint nobody tested, and scattered checks are
hard for agents to get right or to review. Types can prove a check happened;
tests prove the check is correct, but only where tests exist. Effect's
`HttpApiMiddleware` can declare services it `provides` to handlers.

Projects meet two authentication situations, sometimes mixed: apps that own
their users, and apps behind an identity provider (Cognito, Entra, …).

## Decision

**Authorization, phase 1 (in the kernel):**

1. **`CurrentPrincipal`** (`User | System | Anonymous`, extensible) is
   provided by authentication middleware through `provides`.
2. **Every endpoint declares its access:** `public`, `authenticated` or
   `policy("name")`. An undeclared endpoint fails at startup and in
   `toolbelt check`.
3. **Authorization tests are generated from the API definition:** anonymous
   requests to non-public endpoints are rejected, and every policy endpoint
   must supply an *allowed* and a *denied* fixture (the denied pair is the
   IDOR test). A missing fixture fails.
4. **Policies are plain functions** behind `Policy.authorize`, failing with a
   typed `Forbidden`, with table-driven tests for their logic.
5. **`Policy.asSystem(reason)`** with fixed reasons is the only escape: logged
   at runtime, listed and reported by `toolbelt review-exceptions`.
6. A denied resource returns **404** by default (403 opt-in); not logged in
   returns 401.

**Deferred** until the proof of concept shows a need: proof values tied to a
specific resource, viewer-scoped collection queries, an exhaustive policy map,
Postgres row-level security.

**Authentication (recipes; the kernel owns only the `CurrentPrincipal`
contract):**

- **better-auth** — default for apps that own their users. MIT-licensed, data
  in the project's database, mounted with `HttpEffect.fromWebHandler`, using
  its own adapter on the application database, with its schema written into
  our migrations as SQL. Federated login (Entra, Google, OIDC providers)
  through its generic OAuth plugin. On existing databases: map tables and
  columns, move password hashes into its `account` rows, keep old hashes valid
  through custom verification and re-hash on login, users log in once more
  unless the `existing-session` bridge runs during the transition.
- **external-jwt / OIDC** — for apps behind an identity provider; verifies
  tokens and maps claims to a principal.
- **existing-session** — for an existing app's sessions.
- **Mixed cases** use a principal resolution chain (session, then token).
  External accounts are linked only through verified emails.
- **GDPR in the better-auth recipe:** a cleanup job for expired sessions and
  tokens, end-to-end erasure tests (minimum version 1.6.11), an export of auth
  data, the paid dashboard off by default, IP and user agent stored only if
  needed.

## Consequences

- No endpoint can exist without an access decision, and every policy endpoint
  gets an IDOR test without anyone writing it.
- Policy logic correctness still depends on fixtures being meaningful.
- Better Auth is owned by Vercel since July 2026; the lock-in is contained to
  one recipe.

## Alternatives considered

- **Type-level proof values from the start** — strongest, but four mechanisms
  decided before any use.
- **Tests only** — coverage depends on someone remembering.
- **Building authentication in-house** — the riskiest code to own.
