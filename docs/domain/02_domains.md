# Domains

Previous: the [workshops](01_workshops.md).

The formal side of the business, written from the workshops. A business is rarely one thing: each part of it that has its own words is a domain, named as the people inside it would name it, and described in a few sentences they would recognise.

A domain holds three things, written by the maker and owned by the project owner: its glossary, its rules and its questions. The rules are the project's main source of truth. There is no ambiguous term in a domain: when the workshop documents use one word for two different things, the domain makes them distinct.

The description of a domain is short. It describes the essential processes the digital tool will support, without naming any software.

Next: once a domain is clarified, it is [prototyped](03_prototypes.md).

## Risks

Overspecifying. A domain needs just enough to make a prototype: what the prototype does not need yet is not written yet.

## Glossary

- **Domain**: a coherent part of the business, with its own words. In an organisation, a domain typically corresponds to a department or a team.
- **Description of a domain**: what the domain is, in a few sentences, in business terms only.
- **Term**: one concept of a domain, with one name and one definition, in the domain experts' own words. The same name is then used everywhere — in the rules, in the stories, on the screens and in the code.
- **Glossary of a domain**: every term of that domain.
- **Rule**: one sentence, true of a domain, that a domain expert can confirm or deny.
- **Rules of a domain**: everything known to be true of it.
- **Proposed**: a rule written, not yet confirmed.
- **Agreed**: a rule a domain expert has confirmed.
- **Question**: something the project knows it does not know about one of its domains. It is written down as soon as it appears, and stays visible under its domain until it is answered.
- **Open question**: a question not answered yet.

## Rules

**Rule.** A domain is described in business terms only. What the digital tool does about it is the solution, and it is written elsewhere.

**Rule.** The rules are used to build the core of the digital tool: objects, relations, state transitions, which depend on no choice of user interface or outside system.

**Rule.** A rule is proposed when it is written, and agreed once a domain expert has confirmed it. Rewriting an agreed rule makes it proposed again.
