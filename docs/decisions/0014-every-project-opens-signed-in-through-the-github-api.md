# 0014 — Every project opens signed in, through GitHub's API

**Status**: accepted (2026-10); supersedes point 8 of [0010](0010-the-platform-acts-through-a-github-app.md), and how [0012](0012-adapters-are-packaged-by-outside-service.md) reads a repository

## Context

[0010](0010-the-platform-acts-through-a-github-app.md) kept public projects open to anyone, without signing in, by cloning them with git. That served the first stories, which opened a project at the address someone typed.

Nothing in the business needs it any more. A participant comes to the platform for their own projects, to view what matters in them and to take part in them in their role. Opening anyone's public repository is a feature nobody asked for, and it costs the platform the most exposed code it has: cloning any address on the internet, inside bounds of time, size and network written to keep that safe.

Once everyone is signed in, every read can go through the user token 0010 already provides.

## Decision

1. **No project opens without signing in**, public or private. Point 8 of 0010 is withdrawn.

2. **A participant's projects are found, not typed.** They are the repositories their user token reaches through the platform's installations: `GET /user/installations`, then `GET /user/installations/{id}/repositories`. No address is typed in.

3. **A project's files are read through GitHub's REST API with that token** (the contents of the default branch, at the commit it was opened at), never by cloning. Its client is `fetch`, not the `gh` command: `gh` is made for a person at a terminal, and would add a binary to production for what one request does.

4. **The adapter package is `@claree/github-adapters`**, as 0012 asks for one package per outside service. It serves signing in and `ProjectFiles`. `@claree/git-adapters` is deleted with its cache, its local mode and its checks of public addresses, and the production image no longer installs git.

5. **When a participant has no project, the platform says why.** The platform is installed on no organisation they can see, or it is installed and reaches no repository they can read. Each has its own explanation, with what would change it.

## Consequences

**Easier.** The platform reads only what a person could read on GitHub, through the platform's installations, in their name. Nothing reaches an arbitrary address.

**Easier.** Development needs no local repositories: `pnpm dev:mock` signs in as fictional people, and `pnpm dev` signs in with GitHub.

**Harder.** `pnpm dev` without mocks needs the app's client ID and secret, and an organisation where the app is installed.

**Harder.** Every read counts against the participant's rate limit on GitHub's API, 5,000 requests an hour, where cloning counted against none. A project page reads a few files, well under it.

**Harder.** A project hosted anywhere but GitHub cannot be opened. 0008 already put every project on GitHub.
