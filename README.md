# Clarée

Platform where domain experts and makers build an application together, step by step, from a problem the domain experts live with to a fluid application that eases their life.

## What is application co-creation

With or without a supporting platform, a typical project goes round the following cycle for every new domain it addresses:

1. **Workshop** — the domain experts and the maker meet. What was said, shown or recorded is kept as it came.
2. **Domain** — the business is written from it: its terms, its rules, its open questions, in the domain experts' words.
3. **Prototype** — a prototype with mock-data is tested and refined with users.
4. **Stories** — the validated prototype is cut into stories, each with its business value and development effort.
5. **Roadmap** — the stories are prioritised and scheduled.
6. **Implementation** — each story is implemented and deployed in an integration environment.
7. **Version** — done stories are gathered, deployed to production.
8. **Feedback** — the users can give feedback, potentially generating new workshops.

## Why a supporting platform

GitHub, or any other software forge, supports some of this cycle, but it is made for developers, not for domain experts or end users, and it would be overwhelming to ask them to use it. The domain experts and the maker would have to keep their own notes, and the project would be split between the forge and those notes.

The aim of the platform is to support the cycle above, and to do it in a way that keeps the whole project in one GitHub repository: the business in its files, the solution in its issues, and code. So any new participant can read the whole project in one place, and the project is not tied to the platform: if it stops existing, the project is still a repository, and they still own it.

## How: an interface to GitHub

The project owner owns a GitHub organisation, where their projects live and they invite the makers as members. The platform is just an **interface to GitHub**: it reads a project's repository, shows it to the domain experts, and writes changes back as commits, pull requests and issues. Nothing is stored in the platform itself, and nothing is lost if the platform stops existing.

The business is in files, and changes with the code that applies it:

```bash
project/
├── README.md                   # the scope: what the application is for
├── CHANGELOG.md                # each version and the stories it carried
└── docs/
    ├── workshops/
    │   └── <date> <title>/     # what a workshop left behind: notes, recordings, slides
    ├── domain/                 # one file per domain: terms, rules, questions
    └── glossary.md             # each term ↔ its name in the code
```

Each step of the cycle has its place in the project:

| Step | Where it lives |
|---|---|
| Scope | `README.md`: what the application is for |
| 1. Workshop | `docs/workshops/<date> <title>/`: notes, recordings, slides, as they came |
| 2. Domain | `docs/domain/`: one file per domain, its terms, rules and questions; `docs/glossary.md`: each term ↔ its name in the code |
| 3. Prototype | a `prototypes/<number>` branch, built like the application, with mock data |
| 4. Stories | issues: a feature is an issue labelled `feature`, its stories are its sub-issues, with `value:` and `effort:` labels |
| 5. Roadmap | what blocks a story ("blocked by"), and its value for its effort, say what comes next; a milestone gathers the next version |
| 6. Implementation | a `stories/<number>-<title>` branch, and a pull request that closes the story |
| 7. Version | the milestone, cut as a git tag and a section of `CHANGELOG.md` |
| 8. Feedback | an issue, which may call for a new workshop |


The choices behind this are in [`docs/decisions/`](docs/decisions/README.md).

## This repository

This platform is built with its own method, so this repository follows the layout above, and its features and stories are its [issues](https://github.com/softersoftware/claree/issues). The code:

```bash
apps/web/            # the application
packages/domain/     # the business rules, pure TypeScript, no dependencies
packages/adapters/   # what the domain reaches outside itself, each with a mock
```

```bash
pnpm install
pnpm test                                                    # the domain and the adapters
pnpm --filter @claree/web dev                                # projects read from their repositories
CLAREE_ADAPTERS=mock pnpm --filter @claree/web dev           # no outside service at all
docker build -t claree . && docker run -p 3000:3000 claree   # as in production
```
