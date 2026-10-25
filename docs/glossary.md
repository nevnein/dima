# Glossary

Back to [CONTEXT](CONTEXT.md).

Shared vocabulary for people and agents working on Dima or with it.

## Effect terms (v4)

| Term | Meaning |
| ---- | ------- |
| **Effect** | A lazy, typed description of a program: `Effect<A, E, R>` — succeeds with `A`, fails with `E`, requires services `R`. |
| **Service** | A typed dependency, defined as a `Context.Service` class and accessed with `yield* Service`. |
| **Requirements (`R`)** | The services an Effect or Layer needs. Dima uses them as guardrails (for example, handlers may not require a raw data client). |
| **Layer** | A blueprint that builds services, possibly from other services and resources: `Layer<ROut, E, RIn>`. |
| **Scope** | Manages resource lifetimes; finalizers run on close. |
| **Schema** | Runtime and static description of data: decode, encode, validate. |
| **Config** | Typed configuration reading with pluggable providers; a `Config` is itself an Effect. |
| **Schedule** | A value describing repetition and retry policy. |
| **Stability** | Per-module label: *stable* (semver), *unstable* (may break in minors), *experimental* (may break in patches). |

## Dima terms

| Term | Meaning |
| ---- | ------- |
| **Kernel** | The `@nevnein/dima` npm package: guardrails, contracts, generic infrastructure, CLI and agent knowledge. Never modified in projects ([ADR-0005](adr/0005-kernel-recipes-and-agent-knowledge.md)). |
| **Recipe** | An advanced starting point (code, `INSTALL.md`, tests) installed into a project, adapted, then owned by it. |
| **Setup** | The process that inspects a project, asks what it can't detect, and records decisions ([ADR-0009](adr/0009-setup-installation-and-decision-log.md)). |
| **Decision log** | A structured file in each project recording its decisions, reasons, dates and who took them. |
| **Decision guide** | A kernel-defined decision (options, criteria, consequences, who decides) rendered as CLI questions and guide text ([ADR-0010](adr/0010-decision-guides.md)). |
| **Guardrail** | Anything that stops an agent from getting something wrong, from types to runtime guards ([ADR-0007](adr/0007-guardrail-model-and-rule-catalogue.md)). |
| **Rule catalogue** | The kernel's tool-neutral list of rules, rendered into a specific linter's configuration. |
| **Escape hatch** | A declared exception to a rule: `// dima-allow <rule-id> <reason>: <explanation>` ([ADR-0008](adr/0008-escape-hatches-baseline-and-integrity.md)). |
| **Baseline** | The recorded set of violations that existed before adoption; checks fail only on new ones. |
| **Integrity check** | The part of `dima check` that verifies the guardrails themselves are intact. |
| **Sandbox** | A throwaway database instance created by the toolchain; the only place agents may write ([ADR-0015](adr/0015-agent-environment-safety.md)). |
| **Principal** | Who is calling: `User`, `System` or `Anonymous`, provided as `CurrentPrincipal` ([ADR-0013](adr/0013-authentication-and-authorization.md)). |
| **Policy** | A plain function deciding whether a principal may perform an action on a resource. |
| **Framework state** | Data owned by the kernel's infrastructure: queues, workflow journal, cron state, cache, rate limits, failed jobs ([ADR-0011](adr/0011-storage-engines-and-framework-state.md)). |
| **Adoption mode** | *New*, *alongside* or *embedded* ([ADR-0012](adr/0012-adopting-existing-projects.md)). |
| **Border adapter** | An Effect service wrapping code outside the Dima subtree, with typed errors and Schema-decoded results. |
| **Cutoff** | The point after which an old system stops releasing and work moves to Dima. |
| **Job** | A unit of background work, executed by idempotency key with a retry policy ([ADR-0014](adr/0014-background-work.md)). |
