# 0012 — Adapters are packaged by outside service, mocks included

**Status**: accepted (2026-10)

## Context

[0003](0003-hexagonal-monorepo-pure-domain.md) gives every port a mock adapter, so that the platform runs with no outside service. [0006](0006-main-is-production-stories-and-prototypes-are-branches.md) asks more of a prototype: it depends on nothing outside itself, and it is built like the application.

Today one package, `@claree/adapters`, holds both: the mock of `ProjectFiles`, held in memory, and the adapter that reads repositories with git. The invented project the mock opens is written in the application, in `apps/web/src/adapters.ts`.

The forces at play:

- **A prototype stays offline only by convention.** Nothing stops it from importing a real adapter, since both are in the package it depends on.
- **Real adapters bring dependencies.** Speaking to GitHub through its API, as [0008](0008-the-business-is-in-files-the-solution-in-github-issues.md) and [0010](0010-the-platform-acts-through-a-github-app.md) ask, means a client and what it needs to sign people in. A mock needs none of it.
- **Nothing checks that a mock behaves like the real adapter.** A mock that answers more kindly than the real one makes the prototype flatter production, and the difference is found in front of a domain expert.
- **Both adapters already share code.** The link to a repository is used by the mock and by the git adapter.
- **This repository is the reference for what the platform generates**, as 0003 says. An existing project keeps its mocks in a folder of its application, with their invented data next to them. Whatever is chosen here becomes the shape of every generated project.

## Decision

1. **Adapters live under `packages/adapters/`, one package per outside service**, named after it: `packages/adapters/github` is `@claree/github-adapters`. Another host, such as GitLab, would be a package beside it — and first a decision superseding the part of 0008 that keeps the platform to GitHub.

2. **Mock adapters are a package of their own, `packages/adapters/mock` (`@claree/mock-adapters`).** It holds every mock adapter and the invented data they serve. It depends on `@claree/domain` and nothing else.

   The adapter that reads repositories with git moves to `packages/adapters/git` (`@claree/git-adapters`), until an adapter speaking to GitHub's API replaces it, as 0008 asks.

3. **No adapter package imports another.** What both need is a rule about the business, and belongs in the domain: the link to a repository moves there.

4. **Every port has a contract**: the tests every adapter of that port must pass, written once, next to the port, in `packages/domain/src/ports/<port>.contract.ts`. Each adapter package runs the contract of every port it adapts, without the network. The contracts are exported apart from the rules, so that nothing at runtime imports them.

5. **The application chooses its adapters in one place, `apps/web/src/adapters/`**: one file for the mocks, one for the real adapters, and nothing else there or anywhere imports an adapter package. A prototype has only the first, and depends on `@claree/mock-adapters` alone.

   **The choice is made when the application is built, not when it starts.** The production image contains no mock, and an image built with the mocks contains no real adapter.

6. **The domain declares every port in one type, `Ports`.** A package for an outside service adapts only the ports that service answers: GitHub the project's files and who is signed in, a database what the platform keeps of its own. The mock package adapts them all, and so does the application's file for the real adapters, taking each port from whichever package serves it. Both are typed `Ports`, so that a missing port fails to compile.

## Consequences

**Easier.** A prototype that depends on nothing outside itself is proved by its dependencies, not promised by its makers.

**Easier.** The mode with no outside service and every prototype show the same invented projects, written once.

**Easier.** A mock cannot promise what the real adapter does not keep: both pass the same contract, and a difference fails a test before it reaches a screen.

**Easier.** Generated projects get the same shape: a pure domain, its ports with their contracts, one package of mocks, one package per outside service.

**Easier.** "Every port has a mock adapter", from 0003, is checked when the code compiles: a port added without its mock, or left without an adapter in the application, is an error, not an oversight.

**Easier.** A project on another host depends on its own adapters and on the mocks, never on GitHub's.

**Harder.** One more package for every outside service: its manifest, its configuration, a line in the Dockerfile.

**Harder.** A port's contract is written before either of its adapters. That is deliberate friction, on top of what 0003 already accepts.

**Harder.** The domain exports test code, apart from its rules. It needs the test runner to run them, as a development dependency only, so its runtime still depends on nothing.

**Easier.** Production cannot show invented projects to real people by mistake: a wrong setting on the host cannot bring back mocks the image does not contain.

**Harder.** Changing between the mocks and the real adapters means building again, and the application must pick its adapters when it is built rather than with a test when it starts.
