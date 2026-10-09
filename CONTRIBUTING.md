# Contributing

How a project built with the method is laid out, and how its files are written. It is the same for every such project, whatever it does and however much it grows.

## The files

```bash
README.md               # the scope
CHANGELOG.md            # each version and the stories it carried
docs/
├── workshops/          # what the domain experts said, as it came
├── domain/             # the business, one file per domain
├── glossary_bridge.md  # each term and its name in the code
└── decisions/          # the choices behind the software
```

Features and stories are not files: they are issues, where the conversation about them happens.

### `README.md`

Its title is the project's name. The first paragraph under it is the scope: a few sentences saying what the digital tool is for and what it is not, short, broad and deliberately vague. It hardly changes over the life of the digital tool. What follows is for whoever works on the project: how to run it, where things are.

### `CHANGELOG.md`

One section per version, the most recent first: its name, its date, and the stories it carried. A version carries only done stories.

### `docs/workshops/`

One folder per workshop, named by its date and its title: `20260916 general presentation/`. It holds what the workshop produced, as it came: slides, recordings, notes, reports, transcripts.

- A workshop is what was said on one day. Its documents are never rewritten to say what was understood later: that is a later workshop, or it is written in a domain.
- A document can be added after the day — a report or a transcript often comes later — and it is always about that day.

### `docs/domain/`

One file per domain: one part of the business with its own words, named as the people inside it would name it. A `README.md` lists the domains, and says in what order to read them when they follow one another; the files can then be numbered in that order.

Each file has the same shape:

- **A description**: a few sentences on what the domain is and the essential processes the digital tool supports, in business terms only.
- **Glossary**: every term of the domain, `- **Term**: definition`, one name and one definition each, in the domain experts' own words. A word used for two things in the workshops becomes two terms here.
- **Rules**: what is true of the domain, one rule per paragraph, each a sentence a domain expert can confirm or deny.
- **Questions**, when there are any: what the project knows it does not know about the domain, until it is answered.

How they are written:

- No mention of a tool, a piece of software or a technique: no framework, no host, no database, no product name. They belong in `docs/decisions/`.
- They describe the business only. They change when the business changes, never when the tooling does, and never say what is "already built", "in progress" or "planned".
- They are written in one language: the domain experts'.
- Keep it short. A rule nobody can find is a rule nobody follows, and a rule earns its place when something runnable needs it.

### `docs/glossary_bridge.md`

The bridge between the domains and the code: for each term the code names, the name it has there. One table per domain, linking to its file, with two columns: the business term, and its name in the code.

- A term appears here only once the code names it, in the same change. A term the code does not name yet has no row: it is defined in its domain, and that is enough.
- Every name here exists in the code, and every name the code gives a business concept has its row.
- When the code is written in another language than the business, the bridge is where one is translated into the other. When both are in the same language, it fixes which word is used, and forbids the synonyms: most naming drift in a codebase is not a wrong word, it is three right ones for the same thing.

### `docs/decisions/`

One file per structural decision about the software, numbered in order: `0001-a-short-title.md`. Each says its **Status** (proposed, accepted, or superseded by a later one), its **Context** (the forces at play), the **Decision**, and its **Consequences** (what becomes easier, what becomes harder). A `README.md` lists them.

A decision is not rewritten once accepted: a reversed decision gets a new file that supersedes it. Tool names belong here.

## A new concept or rule

1. It is written in its domain first, with its terms in that domain's glossary.
2. Then it is implemented, with its tests, when a story needs it, using the names of the domain's glossary.
3. In the same change, each term the code now names gets its row in `docs/glossary_bridge.md`.
4. Then the digital tool uses it.
