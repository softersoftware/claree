# Project and participants

A project starts when a project owner asks for a digital tool to support their business processes or their personal activities. The project owner knows the scope they want, and the scope delimits the domains the tool covers. A change of scope normally means a new project.

A project belongs to its project owner, from the first day and whatever happens to the maker afterwards.

## Glossary

- **Project**: one digital tool, carried by its project owner and built with its domain experts.
- **Digital tool**: what a project builds to support business processes or personal activities.
- **Scope**: a few sentences saying what the digital tool is for and what it is not. It is short, broad and deliberately vague, and it hardly changes over the life of the project; the precision lives in the [domains](02_domains.md).
- **Business**: what the digital tool serves, described in the words of the people who know it. The domain experts explain it in [workshops](01_workshops.md), and it is written as [domains](02_domains.md).
- **Solution**: what the digital tool does about the business: its [prototypes](03_prototypes.md), its [features and stories](04_stories.md), its versions.
- **Participant**: anyone taking part in a project.
- **Domain expert**: knows how the business works and says what it needs. Never *customer* or *client*.
- **Project owner**: carries the project, and owns its repository.
- **Maker**: listens, brings the craft, builds and maintains.
- **Business analyst**: the maker who writes the domains from the workshops.
- **Language of a project**: the language its domain experts speak.
- **Repository**: a project's files and their history.
- **Address of a project**: where its repository is.
- **Public project**: read without saying who you are.
- **Private project**: read only by the people it recognises.
- **Someone's projects**: the ones they added.

## Participants

- The **domain experts** take part in the workshops; their words are the ones the business is written in, and they confirm its rules and validate its prototypes.
- The **project owner** owns the project's repository, and the project is theirs. When the domain experts hesitate or disagree, the project owner settles.
- The **maker** helps the domain experts find what answers the need, builds and maintains it, and writes the business down. A maker can hold several roles: [UX designer](03_prototypes.md), UI designer, business analyst, architect, coder, tester.

One person may hold several — the project owner is often a domain expert too — and the roles say what someone brings to the project, never what they are allowed to touch.

## Rules

**The written business is the source of truth.** The digital tool is a consequence of it, never the other way round.

**Agreement is explicit.** A domain expert agrees to something named, on a date. What they leave open, the project owner settles, the same way.

**No part of a project may depend on the platform continuing to exist.** A project abandoned by its maker, and by the platform, remains a digital tool another maker can pick up by reading its business.

**Rule.** The features of a project are drawn from its scope and from its domains. A feature the scope cannot account for is not wanted, or belongs to a new project.

### Language

**Rule.** A project is written in the language of its domain experts: its business, its features and its stories. Its code may be written in another; the glossary gives each term its name there.

**Rule.** The platform speaks to each person in the language they choose, and says which language a project is written in, so the one is never mistaken for the other.

**Rule.** A person may ask to be spoken to in the language of whatever project they are reading. That is still their choice, and it translates nothing: the project keeps its own words.

### Arriving at a project

A project is never created by the platform. It already exists, in its repository, and it goes on existing if the platform stops. The platform **opens** it at its address. Anyone who may read the project can look at its repository without the platform.

**Rule.** A project says what it is in its own repository, in one place: its README. Its name is the README's title, and its scope is the first paragraph under that title. A project with no README, or whose README has no title, is named by its address; with no paragraph under the title, its scope is empty.

**Rule.** A public project is read without saying who you are. Its business, its solution and its versions are looked at by anyone, at no cost and with nothing asked. A private project is read only by the people it recognises.

**Rule.** Changing anything means saying who you are, and being someone the project already recognises. The platform grants nothing of its own: it can only act where the person could already act without it.

**Rule.** Someone's projects are the ones they have **added**, each at its address. Adding grants nothing: a project is added only if it can already be opened. What someone added is theirs alone to see — they remove it whenever they like, and the project loses nothing by it.
