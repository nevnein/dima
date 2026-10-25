# ADR-0017: Verification loop and evaluation

- **Status:** Accepted
- **Date:** 2026-10-25
- **Related:** ADR-0001, ADR-0007, ADR-0013, ADR-0016

## Context

Agents need one fast, faithful command to know whether a change is correct,
with output that fits their context window. Proving the app works end to end
depends on each project's harness. And there is no published measurement of
agents writing Effect v4, nor of whether Dima's guardrails help.

## Decision

1. **`dima check`** is **fast by default** (type-check with Effect
   diagnostics, lint on changed files, affected tests); **`--full`** runs
   everything (Squawk, integrity, the whole suite) and is what CI uses. A
   `pre-commit` hook runs the fast mode.
2. **Output:** one line on success; every failure with rule ID, location,
   message and fix; `--json` with a stable format; meaningful exit codes.
   Independent stages run in parallel, each to completion. Output is bounded
   (per-stage summary, first N failures plus a count) and ordered by likely
   root cause, type errors first.
3. **`dima verify`**: the kernel provides the command and its contract
   (start, prove, report evidence, clean up). The verification decision guide
   wires in an existing harness (Playwright, supertest, Bruno, Postman, a test
   compose, a `verify-*` skill) or installs the default verify recipe (start
   against a sandbox, health check, generated authorization tests over HTTP).
   It runs only if `check` passes. The generated authorization tests also stay
   in `check`, in memory through `HttpApiTest`.
4. **Definition of done**, in the kernel's `AGENTS.md`: `dima check`
   passes; a behaviour change also needs a test that exercises it or a passing
   `verify`; the final report includes the evidence; compiling isn't done.
5. **CI is an owned recipe**; its flavour varies, the idea doesn't.
6. **An eval, after the proof of concept:** about 10 tasks with hidden tests,
   two conditions (plain Effect with its `AGENTS.md`, and Dima), 3 runs
   each. Metrics: hidden tests passed, remaining check violations,
   iterations/time/tokens, escape hatches used, v3 APIs (secondary). An
   agent-agnostic harness (a command template per agent, a sandbox and fresh
   copy per run, the agent and model recorded). It serves as a regression
   suite for kernel changes, run on demand, not in CI.

## Consequences

- Agents get a complete picture in one run without flooding their context.
- Guardrail changes can be judged by measurement instead of belief.
- Each eval costs about 60 agent runs.

## Alternatives considered

- **Full checks by default** — too slow for the inner loop.
- **Fail-fast across stages** — saves no time when stages run in parallel.
- **A generic verification skill per project** — Dima knows the app's
  structure and can generate the checks instead.
