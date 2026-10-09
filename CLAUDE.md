# Instructions for Claude Code

Read `README.md` for the full picture, and `CONTRIBUTING.md` for how its files are written. The essentials:

- The platform this repository builds is a tool for specifying, prototyping and maintaining applications with the domain experts in the conversation. **It is built with the method it sells**: specification first, pure domain, mock adapters everywhere. Every cost it imposes on its users, its makers pay first.
- `docs/domain/` is the source of truth for business rules, tool-free. **A rule not written there does not exist.** Each domain file defines its terms in its own glossary; `docs/glossary_bridge.md` maps the ones the code names to their names there, and only those; a test in `packages/domain` checks it against the code.
- **No tool names in `docs/domain/`**, as `CONTRIBUTING.md` says. The platform is a tool for making software, so the temptation is constant. `Specification`, `prototype`, `demonstration` are business concepts of this product; named products are not.
- **The product is not named in its own specification** ([0011](docs/decisions/0011-the-product-is-not-named-in-its-specification.md)). `docs/domain/`, the glossary, decisions from 0010 on, stories, features and code comments say "the platform". The name appears only in the README's title, `docs/branding/`, and the one value the screens take it from.
- Any new business rule follows the order in `CONTRIBUTING.md`; here, it is implemented in `packages/domain` with its tests (pure, no I/O), then integrated in the app.
- **Hexagonal**: the domain never imports a framework, an ORM or an SDK. The repository host, the code generator and any language model are **ports**, not dependencies. One external service = one port + one adapter.
- **Every port has a mock adapter**, so the platform runs end-to-end with no external service. Adding a port means adding its mock alongside.
- Structural decisions go in `docs/decisions/` as ADRs before they go in the code. The three that constrain everything: [0001](docs/decisions/0001-specification-lives-in-the-project-repository.md) specification lives in the project's repository; [0002](docs/decisions/0002-customer-edits-the-specification-never-the-code.md) the domain expert edits the specification, never the code; [0003](docs/decisions/0003-hexagonal-monorepo-pure-domain.md) hexagonal monorepo, pure domain.
- **No part of a project may depend on the platform continuing to exist.** Treat any proposal that breaks this as wrong by default and say so, whatever it buys.
- **No code ahead of what runs (YAGNI).** Write only the code a current feature of the application uses, and its tests. A rule written in `docs/domain/` does not call for code until a story needs it; code that nothing in `apps/web` reaches is deleted, not kept for later.
- **Keep it short, and stay one step ahead of the prototype, never further.** A rule earns its place in `docs/domain/` when something runnable needs it. The first version of this repository specified a product nobody had seen; that is the mistake to avoid, and ADR [0004](docs/decisions/0004-the-prototype-is-a-web-application-held-in-memory.md) says why.
- Language: code, comments, tests and docs in English. How the platform speaks — sober, plain, direct — is `docs/branding/tone.md`; every visible string answers to it. Keep visible strings short and simple, the way a person would say it: "You need to be signed in to access your projects", not "A project opens only to someone signed in, with the GitHub account it knows them by".
- This repository is public. The reference implementation and first project the platform serves is a private repository and must never be named here — not in `docs/`, not in `README.md`, not in commit messages. Refer to it as "an existing project" when its existence is load-bearing for an argument. Local, uncommitted notes may name it.

## Status

pnpm monorepo, vitest for the domain:

- `packages/domain` (zero runtime dependencies) — `project` (a project's name and scope from its README, the link to its repository), one port, `ports/project-files` (`ProjectFiles`, which opens a `Repository`), with its contract (`@claree/domain/contracts`), `Ports`, every port in one type, and the test that checks the glossary.
- `packages/adapters/*` — one package per outside service ([0012](docs/decisions/0012-adapters-are-packaged-by-outside-service.md)): `mock` (`@claree/mock-adapters`, every port, invented projects in memory) and `git` (`@claree/git-adapters`, `ProjectFiles` from a repository: public https only, local paths when asked). Each runs the contract of the ports it adapts.
- `apps/web` — the application (Next.js): a project opened at the address of its repository. Its adapters are chosen when it is built, in `src/adapters/`: `CLAREE_ADAPTERS=mock` (`pnpm dev:mock`) builds it with the mocks only; the root `Dockerfile` is production, with no mock.
- The platform's own features and stories are [its GitHub issues](https://github.com/softersoftware/claree/issues), as [0008](docs/decisions/0008-the-business-is-in-files-the-solution-in-github-issues.md) says: a feature is an issue labelled `feature`, its stories are its sub-issues, business value and effort are labels, what blocks a story is GitHub's "blocked by".

`main` is production ([0006](docs/decisions/0006-main-is-production-stories-and-prototypes-are-branches.md)): each story is built on a `stories/<story>` branch, each ADR on an `architecture/<decision>` branch, a change to the business on `business/<what>`, tooling, CI and dependencies on `technical/<what>`, anything small on `quickfix/<what>`, and sketches and prototypes have theirs ([0013](docs/decisions/0013-sketches-and-prototypes-have-their-own-branches.md)): a sketch of the whole scope on `sketches/<number>`, never updated; the prototype of a version on `prototypes/<version>`, rebased on `main`. Both are built like the application with mock adapters, and never merged as a whole: story branches take their screens, and a story's mock-up is made on its own branch. The prototype that was `apps/web` is a sketch, `sketches/001`: fictional projects in memory, no outside service. A pull request's title starts with the kind of its branch (`story #29: …`, `business: …`); pull requests are squashed, so that title is what `main` keeps.

Not started: reading a specification from a project's own files beyond its address, the generator, and the portal. The layout in `README.md` is the current state, not a target.

Imports inside a package are extensionless, resolved by vitest and `tsc`.

`pnpm test` runs the domain.
