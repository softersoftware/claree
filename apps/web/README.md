# @claree/web — sketch 002

The platform's own sketch: arriving at a project, then its overview (the scope, and who takes
part) and its three parts — the business (workshops by date, domains with their lexicon, rules and
questions), the features (stories and prototypes), and the versions.

Two projects are on offer. The platform's own project is public: it can be read without signing
in. **Medito** is an invented association of meditators, a private project read only by the people
it recognises.

It speaks French or English — the visitor's choice, else their browser's — through two dictionaries
in `src/i18n`. The projects are written in French, say so, and are never translated.

It runs entirely in the browser, with the mock adapters only (`@claree/mock-adapters`): the
projects are held in memory, and who is here, and which projects they added, are stored by the
visitor's own browser. Signing in invents one account. Every decision comes from `@claree/domain`;
the rule that changing anything means being recognised is enforced in the actions, not in the
buttons.

```bash
pnpm dev        # http://localhost:3000
```

Changes last until the page is loaded again. Every push to this branch publishes it on the
repository's GitHub Pages, under `sketches/002/`.
