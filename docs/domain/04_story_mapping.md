# Story mapping

Previous: the [prototype](03_prototypes.md).

The prototype is cut into a few features, each split into its smallest atomic functionalities: its stories. A story makes a visible change to the interface, is useful, and can be tested. Together they make the story map.

Next: once each story has its value and its effort, the story map is sliced into versions in [version planning](05_version_planning.md).

## Risks

Underestimating the effort, and losing touch with the business: a story that no longer says who wants what, and why, in the words of the domains.

## Glossary

- **Story map**: the features of the prototype, and the stories under each.
- **Feature**: one thing the digital tool offers, named in a way the domain expert would use in a sentence: the video library, registering for an event.
- **Story**: one thing a person wants to do, and why: a person, an intention and a reason.
- **Reason**: why the person wants it; every story has one. It is the part most often dropped and the part that matters most: it lets a maker propose something better than what was asked, and it lets everyone notice later when a story no longer serves anything.
- **Business value**: what a story is worth to the business, as a size.
- **Effort**: what a story costs to build, as a size.
- **Size**: one of XXS, XS, S, M, L, XL.
- **What a size stands for**: 1, 2, 3, 5, 8, 13, so that value and effort can be weighed against each other. The gaps widen on purpose — the larger something is, the less precisely it is known.
- **To do**, **in progress**, **done**: where a story is, in that order. It is done when the domain expert could see it working, not when the code exists.

> As a *member*, I want to *watch a guided meditation from my phone*, so that *I can practise wherever I am*.

## Rules

**Rule.** A feature is in progress as soon as one of its stories is, and done when all of them are.

**Rule.** Every story belongs to exactly one feature.

**Rule.** Stories use the words of the [domains' glossaries](02_domains.md).

**Rule.** Business value is set by the domain experts.

**Rule.** Effort is stated by the maker.
