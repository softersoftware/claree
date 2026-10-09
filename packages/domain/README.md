# @claree/domain

The business rules of the platform as pure TypeScript: **zero runtime dependencies**, no framework, no I/O.

Every business concept here has its row in the [glossary bridge](../../docs/glossary_bridge.md) and a document behind it in [`docs/domain/`](../../docs/domain/README.md). Read those first; this package only says the same thing in a language a machine can check.

- `project.ts` — a project's name and scope, read from its README, and the link to its repository.
- `ports/project-files.ts` — a project's repository, read and never written.
- `ports/ports.ts` — every port in one type, `Ports`, which the mock adapters and the application's real adapters each serve in full.
- `glossary.test.ts` — the glossary bridge against the code: every row has a name, and every name exists.
- `ports/*.contract.ts` — what every adapter of a port must do, as tests, exported apart from the rules as `@claree/domain/contracts`.

```bash
pnpm --filter @claree/domain test
```
