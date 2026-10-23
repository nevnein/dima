# ADR-0010: Decision guides

- **Status:** Accepted
- **Date:** 2026-10-25
- **Related:** ADR-0009, ADR-0002

## Context

Choosing the paradigm and infrastructure (queue or workflow, which database,
how many instances) is where agents most often go wrong, and where the
decision matters most. Effect's own agent docs don't cover these choices.

## Decision

1. **Each project decision is defined once, as data, in the kernel:** the
   question, allowed options, how to detect the answer, criteria for each
   option, consequences (what gets installed, which guarantees change),
   anti-patterns, and the log entry it produces. Both the CLI questions and the
   guide text (read in place) are generated from this one source.
2. **Each decision says who decides:**

   | Class | Meaning | Examples |
   | --- | --- | --- |
   | `agent` | The agent decides and logs it with its reason | job vs schedule vs workflow; retry `Schedule` |
   | `ask` | The agent proposes, the user confirms | database engine, auth recipe, adoption mode, deploy target |
   | `user` | Only the user decides; the agent can't propose | cutoff, redirecting conventions, anything production |

   Rule of thumb: cheap to reverse → `agent`; expensive → `ask`;
   organizational → `user`.
3. **Each choice records when to revisit it**, and `toolbelt check` reports
   triggers it can detect.
4. **Initial guides:** background work, data and framework-state storage,
   adoption mode, authentication, API shape, deployment and instances,
   verification.

## Consequences

- Agents move fast on cheap decisions and stop on expensive ones.
- Guides and CLI can't drift apart.
- Writing a guide means writing criteria precise enough to be data.

## Alternatives considered

- **Prose guides only** — drift from the CLI, not machine-checkable.
- **Ask the user everything** — slow, and the agent learns nothing to apply.
