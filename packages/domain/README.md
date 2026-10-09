# @claree/domain

The business rules of the platform as pure TypeScript: **zero runtime dependencies**, no framework, no I/O.

Every type and function here has an entry in the [glossary](../../docs/glossary_bridge.md) and a document behind it in [`docs/domain/`](../../docs/domain/README.md). Read those first; this package only says the same thing in a language a machine can check.

- `project.ts` — a project's name and scope, read from its README, and the link to its repository.
- `ports/project-files.ts` — a project's repository, read and never written.
- `ports/ports.ts` — every port in one type, `Ports`, which the mock adapters and the application's real adapters each serve in full.
- `glossary.test.ts` — the glossary against the domain documents and the code: every term defined has a row, every name exists, every export is named.
- `ports/*.contract.ts` — what every adapter of a port must do, as tests, exported apart from the rules as `@claree/domain/contracts`.

```bash
pnpm --filter @claree/domain test
```
