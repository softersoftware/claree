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
| Project | `Project` |
| Business | `Business` |
| Solution | — |
| The platform | `productName` |
| Participant | `Participant` |
| Role of a participant | `Role` |
| Domain expert | `domainExpert` |
| Project owner | `projectOwner` |
| Maker | `maker` |
| Who may agree | `mayAgree` |
| Language of a project | `Project.language` |
| Language the platform speaks | — |
| Repository | `Repository` |
| Address of a project | `Repository.address` |
| Opening a project | `ProjectFiles.open` |
| Where the platform reads projects | `ProjectFiles` |
| What the platform reaches outside itself | `Ports` |
| README | `readme` |
| Name of a project | `Project.name` |
| Reading the name and scope | `nameAndScope` |
| Link to a repository | `Repository.link`, `repositoryLink` |
| Public project | — |
| Private project | — |
| Recognised by a project | — |
| Someone's projects | — |

## Scope — [scope.md](domain/scope.md)

| Business term | Name in the code |
| --- | --- |
| Scope | `Project.scope` |

## Workshops — [workshops.md](domain/workshops.md)

| Business term | Name in the code |
| --- | --- |
| Workshop | `Workshop` |
| Date of a workshop | `Workshop.date` |
| Title of a workshop | `Workshop.title` |
| Document | `WorkshopDocument` |
| Kind of document | `DocumentKind` |
| Slides / video / recording / notes / report / transcript | `slides` / `video` / `audio` / `notes` / `report` / `transcript` |
| Where a document is | `WorkshopDocument.location` |
| Text of a document | `WorkshopDocument.text` |
| Adding a document | `addDocument` |
| Correcting a document | `correctDocument` |
| Workshops by date | `workshopsByDate` |

## Domains — [domains.md](domain/domains.md)

| Business term | Name in the code |
| --- | --- |
| Domain | `Domain` |
| What a domain is | `Domain.description` |
| Term | `Term` |
| Glossary of a domain | `termsOf` |
| Finding a term by its name | `termNamed` |
| Description of a domain | `rulesOf` |
| Rule | `Rule` |
| State of a rule | `RuleState` |
| Proposed | `proposed` |
| Agreed | `agreed` |
| Agreeing | `agree` |
| Rewriting a rule | `restate` |
| Question | `Question` |
| Domain of a question | `Question.domainId` |
| Questions of a domain | `questionsOf` |
| Answering a question | `answerQuestion` |
| Open question | `isOpen` |
| Open questions | `openQuestions` |

## Prototypes — [prototypes.md](domain/prototypes.md)

| Business term | Name in the code |
| --- | --- |
| Prototype | `Prototype` |
| Where a prototype is tried | `Prototype.location` |
| Prototypes of a feature | `prototypesOf` |
| State of a prototype | `PrototypeState` |
| Being tried | `being_tried` |
| Validated | `validated` |
| Validating a prototype | `validate` |
| Mock-up | — |
| Demonstration | — |

## Stories — [stories.md](domain/stories.md)

| Business term | Name in the code |
| --- | --- |
| Feature | `Feature` |
| Stories of a feature | `storiesOf` |
| A feature that describes nothing | `describesNothing` |
| State of a feature | `stateOf` |
| Story | `Story` |
| Reason | `Story.reason` |
| Business value | `Story.value` |
| Effort | `Story.effort` |
| Size | `Size`, `sizes` |
| What a size stands for | `pointsOf` |
| State of a story | `StoryState` |
| To do | `to_do` |
| In progress | `in_progress` |
| Done | `done` |
| Starting a story | `start` |
| Finishing a story | `finish` |
| Stories in each state | `countByState` |

## Roadmap — [roadmap.md](domain/roadmap.md)

| Business term | Name in the code |
| --- | --- |
| Blocked by | `Story.blockedBy` |
| Blocked | `isBlocked` |
| What comes next | `nextStory` |

## Versions — [versions.md](domain/versions.md)

| Business term | Name in the code |
| --- | --- |
| Version | `Version` |
| Gathering a version | `planVersion` |
| Done stories no version carried yet | `releasableStories` |
| The version that carried a story | `versionCarrying` |
