# Glossary of business terms

The bridge between the business documentation ([`docs/domain/`](domain/README.md), tool-free) and the code. Each domain defines its terms in its own glossary; this file says which name each of them has in the code.

The platform's domain documents and its code are both in English, so this glossary is not a translation — it fixes **which** English word is used, and forbids the synonyms. Most naming drift in a codebase is not a wrong word; it is three right ones for the same thing.

- Every term a domain's glossary defines has a row here, with "—" while the code does not name it.
- Every name here exists in the code, and every name the domain package exports has a row. A change that adds a name adds its row.

A test in the domain package checks all three.

> Every project has its own glossary, in its own language. This one is the platform's.

## Project and participants — [project.md](domain/project.md)

| Business term | Name in the code |
| --- | --- |
| Project | — |
| Digital tool | — |
| Scope | — |
| Business | — |
| Solution | — |
| The platform | `productName` |
| Participant | — |
| Domain expert | — |
| Project owner | — |
| Maker | — |
| Business analyst | — |
| Language of a project | — |
| Repository | `Repository` |
| Address of a project | `Repository.address` |
| Opening a project | `ProjectFiles.open` |
| Where the platform reads projects | `ProjectFiles` |
| What the platform reaches outside itself | `Ports` |
| Reading the name and scope | `nameAndScope` |
| Link to a repository | `Repository.link`, `repositoryLink` |
| Public project | — |
| Private project | — |
| Someone's projects | — |

## Workshops — [01_workshops.md](domain/01_workshops.md)

| Business term | Name in the code |
| --- | --- |
| Workshop | — |
| Date of a workshop | — |
| Title of a workshop | — |
| Workshop document | — |
| Text of a document | — |

## Domains — [02_domains.md](domain/02_domains.md)

| Business term | Name in the code |
| --- | --- |
| Domain | — |
| Description of a domain | — |
| Term | — |
| Glossary of a domain | — |
| Rules of a domain | — |
| Rule | — |
| Proposed | — |
| Agreed | — |
| Question | — |
| Open question | — |

## Prototypes — [03_prototypes.md](domain/03_prototypes.md)

| Business term | Name in the code |
| --- | --- |
| UX designer | — |
| Prototype | — |
| Where a prototype is tried | — |
| Being tried | — |
| Validated | — |
| Mock-up | — |
| Demonstration | — |

## Stories — [04_stories.md](domain/04_stories.md)

| Business term | Name in the code |
| --- | --- |
| Feature | — |
| Story | — |
| Reason | — |
| Business value | — |
| Effort | — |
| Size | — |
| What a size stands for | — |
| To do | — |
| In progress | — |
| Done | — |

## Roadmap — [05_roadmap.md](domain/05_roadmap.md)

| Business term | Name in the code |
| --- | --- |
| Version | — |
| Blocked by | — |

## Implementation — [06_implementation.md](domain/06_implementation.md)

| Business term | Name in the code |
| --- | --- |
| Starting a story | — |
| Finishing a story | — |

## Deployment — [07_deployment.md](domain/07_deployment.md)

| Business term | Name in the code |
| --- | --- |
| Deployment | — |
| The version that carried a story | — |
