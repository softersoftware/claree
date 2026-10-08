# Contributing

How the files of this repository are written. What is true of the business is in [`docs/domain/`](docs/domain/README.md); this file only says how it is written down.

## Conventions of the method

The same for every project built with the method, whatever it does and however much it grows.

### The domain files

- Each file in `docs/domain/` has the same shape: a few sentences, with the previous step, the next one and what it takes to move on; its **glossary**, every term it defines with one name and one definition; and its **rules**.
- No mention of a tool, a piece of software or a technique: no framework, no host, no database, no product name. Tool names belong in `docs/decisions/` or `README.md`, nowhere else.
- The domain files describe the business only. They change only when the business changes, never when the tooling does, and never say what is "already built", "in progress" or "planned".
- Keep it short. A rule nobody can find is a rule nobody follows. A rule, or a file, earns its place when something runnable needs it.
- A project is written in one language: its domain experts'.

### A new concept or rule

1. It is written in its domain first, with its terms in that domain's glossary.
2. Each term gets its row in [`docs/glossary.md`](docs/glossary.md), before it gets a name anywhere else.
3. Then it is implemented, with its tests, and the glossary row gets its name in the code.
4. Then the application uses it.

## This repository

- Its domain experts are its makers, so its documents, code, comments and tests are in English.
- How the platform speaks, in every visible string, is [`docs/branding/tone.md`](docs/branding/tone.md).
- Branches and pull request titles say what kind of change they carry, as [0006](docs/decisions/0006-main-is-production-stories-and-prototypes-are-branches.md) says.
