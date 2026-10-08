# The domains of the platform

This folder describes **what the platform does**, in the language of the people it serves, with no reference to technical tooling. It is the source of truth for the vocabulary and the business rules:

- it is the **common language** between makers, domain experts and contributors;
- every term defined here maps to its name in the code in the [glossary](../glossary.md);
- a business rule that is not written here does not exist.

## The cycle

With or without a supporting platform, a project goes round the same cycle for every new domain it addresses. Each step with rules of its own is a domain of the platform, and has its file here.

0. [Scope](00_scope.md) — what the application is for, written once.
1. [Workshops](01_workshops.md) — the domain experts explain the business; what was said and shown is recorded as it came.
2. [Domains](02_domains.md) — the business is written from it, one domain for each part with its own words: its glossary, its rules, its open questions.
3. [Prototypes](03_prototypes.md) — a prototype with mock data is tried and refined with the domain experts and the future users.
4. [Stories](04_stories.md) — the prototype is cut into features and stories, each with its business value and its effort.
5. [Roadmap](05_roadmap.md) — the stories are grouped into versions and put in order.
6. [Implementation](06_implementation.md) — each story is implemented, and tried before it reaches real people.
7. [Deployment](07_deployment.md) — once all its stories are done, a version is put in front of real people.
8. Feedback — real use brings feedback, which may call for new workshops.

What belongs to no step — what a project is, who takes part, its language, arriving at it, and the rules of the whole project — is in [Project and participants](project.md).

A step gets its file when something runnable needs its first rule.

Each file has the same shape: a few sentences, with the previous step, the next one and what it takes to move on; its **glossary** — every term it defines, with one name and one definition — and its **rules**.

## Writing conventions

- No mention of a tool, a piece of software or a technique. The platform is a tool for making software, so the temptation is constant — resist it.
- **These documents change only when the business changes** — never when the tooling changes. Nothing here says what is "already built", "in progress" or "planned".
- Keep it short. A rule nobody can find is a rule nobody follows.

## Language

Unlike another project, whose domain documents are written in the language of its own domain experts, the platform's are written in English: its domain experts are its makers.

When a new concept appears: define it in the glossary of its domain first, then add it to the [glossary](../glossary.md) **before** giving it a name anywhere else.
