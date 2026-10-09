# The domains of the platform

This folder describes **what the platform does**, in the language of the people it serves, with no reference to technical tooling. It is the source of truth for the vocabulary and the business rules:

- it is the **common language** between makers, domain experts and contributors;
- every term defined here maps to its name in the code in the [glossary](../glossary.md);
- a business rule that is not written here does not exist.

## The cycle

With or without a supporting platform, a project goes round the same cycle for every new domain it addresses. Each step with rules of its own is a domain of the platform, and has its file here.

1. [Workshops](01_workshops.md) — the domain experts explain the business; what was said and shown is recorded as it came.
2. [Domains](02_domains.md) — the business is written from it, one domain for each part with its own words: its glossary, its rules, its open questions.
3. [Prototypes](03_prototypes.md) — a prototype with mock data is tried and refined with the domain experts and the future users.
4. [Stories](04_stories.md) — the prototype is cut into features and stories, each with its business value and its effort.
5. [Roadmap](05_roadmap.md) — the stories are grouped into versions and put in order.
6. [Implementation](06_implementation.md) — each story is implemented, and tried before it reaches real people.
7. [Deployment](07_deployment.md) — once all its stories are done, a version is put in front of real people.
8. Feedback — real use brings feedback, which may call for new workshops.

Before the first step, the project owner says what the digital tool is for: its scope. That, and what belongs to no step — who takes part, the language, arriving at a project, and the rules of the whole project — is in [Project and participants](project.md).

How these files are written is in [`CONTRIBUTING.md`](../../CONTRIBUTING.md). The platform's domains are the steps of the cycle, so each file also says the previous step, the next one, and what it takes to move on.

The platform's domain experts are its makers, so these files are written in English.
