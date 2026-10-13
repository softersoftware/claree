# 0013 — Sketches and prototypes have their own branches

**Status**: accepted (2026-10), point 1 amended: a sketch may be rebased or deleted (2026-10); point 6 added: a branding prototype has its own branch (2026-10); point 2 amended: a prototype is named after its milestone (2026-10); supersedes how [0006](0006-main-is-production-stories-and-prototypes-are-branches.md) names a prototype's branch and keeps it up to date; a mock-up tried only from its branch superseded by [0016](0016-the-platform-is-a-single-page-application.md)

## Context

[0006](0006-main-is-production-stories-and-prototypes-are-branches.md) gives every prototype a `prototypes/<number>` branch, brought up to date by merging `main`. It knew one kind of prototype.

The domains now know three, which do not live the same way:

- a **sketch** of the whole scope, shown in a workshop before the domains are written, and never updated afterwards;
- a **prototype** of the next version, kept up to date with the digital tool as it is, and cut into stories;
- a **mock-up** of one story, its final interface, made just before the story is implemented.

`prototypes/001` and `prototypes/002` are the first kind: both cover the whole scope, and were made before the domains of the platform were split. Under 0006 they look like the second, and nothing says they should not be updated.

## Decision

1. **A sketch lives on `sketches/<number>`**, numbered in the order they are made. It is never merged, and what it shows never changes: it stays as it was shown. It may be rebased on `main`, to build with the tooling of the day, as long as its screens stay the same. Its branch may be deleted when nothing calls for it any more, for instance when another sketch shows the same (amended 2026-10).

2. **A prototype lives on `prototypes/<milestone>`**, named after the milestone it prototypes. It is rebased on `main` whenever `main` changes, so that it is always the next milestone on top of what is released (amended 2026-10). It is never merged as a whole: once validated, story branches take its screens, as 0006 says.

3. **A mock-up is made on its story's branch.** The story's first commits take its screens from the prototype and polish them; the story's code is built under them. A mock-up has no branch of its own.

4. **Sketches and prototypes are built like the application and depend on nothing outside themselves**, as 0006 says: mock adapters only, invented data, one command from a fresh clone.

5. **The existing branches are sketches**: `prototypes/001` and `prototypes/002` become `sketches/001` and `sketches/002`.

6. **A branding prototype lives on `branding/<number>`**, numbered in the order they are made, and lives as a sketch does (point 1): it is never merged, and what it shows never changes. The branding it shows, once agreed, is kept in `docs/branding/` (added 2026-10).

## Consequences

**Easier.** A branch's prefix says how it ages: a sketch shows what it showed, a prototype follows `main`, and a story's branch holds its mock-up for as long as the story lasts.

**Easier.** A rebased prototype reads as the next version and nothing else: its own commits, on top of `main`, without the merges 0006 left in it.

**Harder.** Rebasing rewrites the prototype's history. Its branch is force-pushed, and anyone else holding it resets to it rather than pulling. A prototype has one UX designer at a time, which keeps this cheap.

**Harder.** A mock-up on a story's branch can be tried only from that branch, and once the story is merged it is the application itself, not a mock-up any more. That is the point: the mock-up is the story's interface before its code is real.

## Notes

A pull request's title starts with the kind of its branch, as 0006 says: `sketch 001: …`, `prototype <milestone>: …`.

The amendment of point 1 (2026-10) records what was done: `sketches/002` is `sketches/001` rebased, showing the same, and `sketches/001` was deleted. "Never updated", in the domains, is about what a sketch shows, as for every workshop document; rebasing and deleting its branch are not.

Point 6 (2026-10) follows the branding domain: a branding prototype shows a branding before the project owner agrees to it. Like a sketch, it is what was shown on one day; the branding agreed is what the project keeps, in its files.
