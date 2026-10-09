# 0015 — The mock of an outside service serves its pages

**Status**: accepted (2026-10); completes [0012](0012-adapters-are-packaged-by-outside-service.md)

## Context

Some outside services are not only called: a person goes through their pages. Signing in with GitHub ([0010](0010-the-platform-acts-through-a-github-app.md)) sends the person to GitHub's sign-in page and its authorization page, then back to the platform.

With the mock adapters, something has to stand where those pages are. The mock-up of the first story that signs in put them in the application, under `apps/web/src/app/sign-in/mock/`. That has three costs:

- **The pages are in the production image.** They answer nothing there, but their code is built and shipped.
- **The application knows what is invented.** It has to import the mock's accounts to list them, and the file for the real adapters has to export an empty list in their place.
- **The application needs a layout for pages that are not its own**, to keep its header off them.

0012 already keeps every mock in `@claree/mock-adapters` and out of the production image. Pages that imitate an outside service are part of its mock as much as the data it serves.

## Decision

1. **The pages of an outside service are mocked in `@claree/mock-adapters`, never in the application.** For GitHub, these are the sign-in page and the authorization page.

2. **They are served by a small server of the mock package**, in plain `node:http` and HTML, with no framework, so that the package still depends on `@claree/domain` alone. `pnpm dev:mock` starts it beside the application, with one command.

3. **The mock adapter sends the person to that server, as the real one sends them to the service.** `Authentication.start()` returns the server's address, and the server sends the person back to the platform's callback, as GitHub does.

4. **Nothing in the application says it is a mock.** It has no mock page and no list of accounts, and both its adapter files export the same names.

5. **The server is for development and prototypes only.** The production image is built without `CLAREE_ADAPTERS`, so it imports nothing from the mock package and never starts the server.

## Consequences

**Easier.** The production image contains no mock page, and the application is the same in both modes, save the one file that chooses its adapters.

**Easier.** Signing in with the mocks leaves the platform for another address and comes back, like the real thing. A cookie or a `state` lost on the way fails in the mock-up, not in front of a real person.

**Easier.** The same server can later stand in for GitHub in the GitHub adapter's tests. That is left to the story that builds the adapter.

**Harder.** `pnpm dev:mock` runs two servers, and needs a second port free on the machine.

**Harder.** Putting a prototype online means putting its mock pages online too. How prototypes are hosted is still open, as [0007](0007-production-runs-on-koyeb-from-its-own-dockerfile.md) left it.
