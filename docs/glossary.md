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

## Workshops — [step_1_workshops.md](domain/step_1_workshops.md)

| Business term | Name in the code |
| --- | --- |
| Workshop | — |
| Date of a workshop | — |
| Title of a workshop | — |
| Workshop document | — |
| Text of a document | — |

## Domains — [step_2_domains.md](domain/step_2_domains.md)

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

## Prototypes — [step_3_prototypes.md](domain/step_3_prototypes.md)

| Business term | Name in the code |
| --- | --- |
| UX designer | — |
| Prototype | — |
| Where a prototype is tried | — |
| Being tried | — |
| Validated | — |
| Mock-up | — |
| Demonstration | — |

## Story mapping — [step_4_story_mapping.md](domain/step_4_story_mapping.md)

| Business term | Name in the code |
| --- | --- |
| Story map | — |
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

## Version planning — [step_5_version_planning.md](domain/step_5_version_planning.md)

| Business term | Name in the code |
| --- | --- |
| Version | — |
| Blocked by | — |

## Story refinement — [step_6_refinement.md](domain/step_6_refinement.md)

| Business term | Name in the code |
| --- | --- |
| Story refinement | — |
| UI designer | — |
| Architect | — |
| Coder | — |
| Final interface | — |
| Plan of implementation | — |

## Implementation — [step_7_implementation.md](domain/step_7_implementation.md)

| Business term | Name in the code |
| --- | --- |
| Starting a story | — |
| Finishing a story | — |

## Deployment — [step_8_deployment.md](domain/step_8_deployment.md)

| Business term | Name in the code |
| --- | --- |
| Deployment | — |
| The version that carried a story | — |
