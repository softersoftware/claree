# Architecture Decision Records

Records of the structural technical decisions behind the platform: what was decided, in which context, and what it costs. One file per decision, numbered in order (`0001-…`, `0002-…`), never deleted — a reversed decision gets a new ADR that supersedes the old one. The one exception is a decision abandoned before anything came to depend on it: it may be deleted, and its number is used again by the next decision.

Unlike [`docs/domain/`](../domain/README.md) (business rules, tool-free), ADRs are about the software and its tooling. Every tool name in this repository belongs here or in the README, and nowhere else.

Format: **Status** (proposed / accepted / superseded by NNNN), **Context** (the forces at play), **Decision** (what we chose), **Consequences** (what becomes easier, what becomes harder).

## Index

- [0001 — The specification lives in the project's own repository](0001-specification-lives-in-the-project-repository.md)
- [0002 — The customer's editing surface is the specification, never the code](0002-customer-edits-the-specification-never-the-code.md)
- [0003 — Hexagonal monorepo with a pure TypeScript domain](0003-hexagonal-monorepo-pure-domain.md)
- [0004 — Supersoft's own prototype is a web application, held in memory](0004-the-prototype-is-a-web-application-held-in-memory.md)
- [0005 — Git holds the specification; the repository host holds the conversation](0005-git-holds-the-specification-the-host-holds-the-conversation.md) — superseded by 0008
- [0006 — `main` is production; stories and prototypes are branches](0006-main-is-production-stories-and-prototypes-are-branches.md)
- [0007 — Supersoft's production runs on Koyeb, from its own Dockerfile](0007-production-runs-on-koyeb-from-its-own-dockerfile.md)
- [0008 — The business is in files; the solution is in GitHub issues](0008-the-business-is-in-files-the-solution-in-github-issues.md)
- [0009 — Supersoft is named Clarée](0009-supersoft-is-named-claree.md)
- [0010 — The platform acts through a GitHub App, in the name of the person signed in](0010-the-platform-acts-through-a-github-app.md)
- [0011 — The product is not named in its own specification](0011-the-product-is-not-named-in-its-specification.md)
- [0012 — Adapters are packaged by outside service, mocks included](0012-adapters-are-packaged-by-outside-service.md)
- [0013 — Sketches and prototypes have their own branches](0013-sketches-and-prototypes-have-their-own-branches.md)
- [0014 — Every project opens signed in, through GitHub's API](0014-every-project-opens-signed-in-through-the-github-api.md)
- [0015 — The mock of an outside service serves its pages](0015-the-mock-of-an-outside-service-serves-its-pages.md)
- [0016 — The platform is a single-page application, and its prototypes are static pages](0016-the-platform-is-a-single-page-application.md)
