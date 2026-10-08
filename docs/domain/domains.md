# Domains

The formal side of the business, written from the [workshops](workshops.md). A business is rarely one thing: each part of it that has its own words is a domain, named as the people inside it would name it, and described in a few sentences they would recognise.

A domain holds three things, written by the maker and owned by the project owner: its glossary, its description and its questions. The description is the project's main source of truth.

## Glossary

- **Domain**: one part of the business, with its own words.
- **What a domain is**: a few sentences, in business terms only.
- **Term**: one concept of a domain, with one name and one definition, in the domain experts' own words. The same name is then used everywhere — in the description, in the stories, on the screens and in the code.
- **Glossary of a domain**: every term of that domain.
- **Description of a domain**: what is true of it, written as rules.
- **Rule**: one sentence a domain expert can confirm or deny.
- **Proposed**: a rule written, not yet confirmed.
- **Agreed**: a rule a domain expert has confirmed.
- **Question**: something the project knows it does not know about one of its domains. It is written down as soon as it appears, and stays visible under its domain until it is answered.
- **Open question**: a question not answered yet.

## Rules

**Rule.** A domain is described in business terms only. What the application does about it is the solution, and it is written elsewhere. A description that cannot be read by someone who will never see the application has stopped describing the business.

**Rule.** Every term, every rule and every question belongs to exactly one domain — the part of the business that owns the word, even when the rest of the business uses it. A question that fits in no domain is a part of the business nobody has named yet.

**Rule.** A rule not written in the description does not exist. It will not be built, and nobody is at fault when it is missing.

**Rule.** A rule says what the business requires, never what the application is made of.

**Rule.** The rules are the core of the application. Each one can be checked on its own — before any screen exists, and without anything outside the application — and the rest of the application only uses them.

**Rule.** A rule is proposed when it is written, and agreed once a domain expert has confirmed it. Rewriting an agreed rule makes it proposed again: agreement is given to a sentence, not to a subject.

**Rule.** The open questions of a domain are always countable. Building with open questions is normal; not knowing what they are is not.
