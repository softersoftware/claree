# @claree/domain

The business rules of the platform as pure TypeScript: **zero runtime dependencies**, no framework, no I/O.

Every type and function here has an entry in the [glossary](../../docs/glossary.md) and a document behind it in [`docs/domain/`](../../docs/domain/README.md). Read those first; this package only says the same thing in a language a machine can check.

- `project.ts` — the project, its language and scope, its participants, who settles what, and the link to its repository.
- `business.ts` — the workshops on the informal side; the domains, each owning its glossary, its description and its open questions, on the formal one, with agreeing and what rewriting undoes.
- `feature.ts` — the stories a feature gathers, and the state derived from them.
- `story.ts` — stories, their value and effort, their tracking, and what comes next.
- `version.ts` — gathering done stories, and following a deployment.
- `prototype.ts` — the prototypes of a feature, each being tried until a domain expert validates it.
- `ports/project-files.ts` — a project's repository, read and never written.
- `ports/ports.ts` — every port in one type, `Ports`, which the mock adapters and the application's real adapters each serve in full.
- `glossary.test.ts` — the glossary against the domain documents and the code: every term defined has a row, every name exists, every export is named.
- `ports/*.contract.ts` — what every adapter of a port must do, as tests, exported apart from the rules as `@claree/domain/contracts`.

```bash
pnpm --filter @claree/domain test
```
