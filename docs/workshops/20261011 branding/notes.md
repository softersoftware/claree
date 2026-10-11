# Branding

Notes of the day branding was discussed, for any project and then for the platform itself. Held by the project owner, who is also a domain expert, with Claude as maker.

## Branding, for any project

Branding had no place in the method. It was first meant to take the rules of the platform's tone into the domain ([#41](https://github.com/softersoftware/claree/issues/41)); the discussion widened it.

- **A domain outside the cycle.** Branding is a domain of the method, but not a step: like the project and its participants, it belongs to no step, and the cycle does not go round it again for each new domain.
- **When.** Early, but not first: after the scope, once it is clear enough, and often after a first sketch has made it clearer.
- **What it holds.** The name, a tagline, the tone, the colours, the typography, the logo and its forms (the icon of the application, of a browser tab), the iconography, the shapes and the density. Shapes and density were first left out as too fine, then kept.
- **Who.** It is discussed in a workshop, suggested by a maker, a UI or a UX designer, and agreed by the project owner. "Product owner" came up for the same role; which name the method keeps is left to [#66](https://github.com/softersoftware/claree/issues/66).
- **Where it applies.** Sketches and prototypes may ignore it. A mock-up must apply it: the final interface is the branded one.
- **Where it is kept.** `docs/branding/` holds a project's own branding, the platform's included; `docs/domain/branding.md` describes the activity. A branding prototype lives on a `branding/<number>` branch, numbered like sketches, and never changes what it shows.
- **How it is done.** Eight points, taken from how branding is usually done: discovery, personality, naming, tone, directions, trying it, keeping it, changing it. The maker suggests more than one direction, each in a branding prototype, and the project owner chooses.
- **Later.** Changing a branding once agreed, and completing the platform's own, are stories of their own.

Written in [`docs/domain/branding.md`](../../domain/branding.md) (#64).

## The platform's own branding

### Discovery

- **Who it is made for first**: the domain experts. The makers adapt to them.
- **Who the platform is for first**: charities. "Business" sits badly with them: they speak of their work, their activities, their mission. The same word is the method's own; whether it stays is a question for [#66](https://github.com/softersoftware/claree/issues/66).
- **What it must never be mistaken for**: an app generator, a tool that promises software without the conversation.
- **What else they use**: not discussed. The README says the makers use the software forge, which is made for developers and not for the domain experts.

### Personality

- **Clear, attentive, sober.**
- **What a domain expert should feel on opening it**: taken seriously. A professional place, where their work is handled with care.
- **Document or application**: between the two. Calm pages, with clear controls where something can be done.
- **Warmth**: neutral. It steps aside for the projects' own words.
- **Classic or contemporary**: mixed. A serif for what is read, a project's name, its scope, its domains; a sans-serif for the interface.
- **Density**: balanced. Room to breathe, and a project's state at a glance.

### Naming

Clarée is kept. A search found no product of that name; Claritee, a wireframing tool for designers, is close in spelling and in field. The trademark registers were searched by the project owner, with nothing blocking. Claritee is not taken as a problem: the names differ in sound and meaning, and the audiences differ. Only a launch in the United States would call for a second look.

In French, the Clarée is a river and a valley of the Alps; in English, it means nothing, and recalls clarity.

### Tone and tagline

The tone is kept as it is.

- First suggestions spoke of "the business" and of "software" or "an application". "Business" sits badly with charities; "digital tool", the method's own term, is plainer than either.
- The project owner suggested "Making digital tools with and for the people who need them". "With" rules out the app generator; "need" carries the attentive.
- "Making digital tools for you and with you" was suggested next, and set aside: the tone forbids *for you*, and "you" says less than "the people who need them".
- Kept, shorter: **"Making digital tools with the people who need them."** "With" already says "for". In French: « Construire des outils numériques avec celles et ceux qui en ont besoin. », *construire* rather than *faire*.
- A tagline is not strictly needed; it is kept because someone arriving knows nothing of the platform, and one line says what it is.

### Directions

Three branding prototypes, each showing the sign-in page, the Projects page and a project, with mock data:

1. [Ink on paper](https://softersoftware.github.io/claree/branding/001/): off-white paper, near-black ink, one quiet green; Source Serif 4 and Source Sans 3; small corners.
2. [Slate](https://softersoftware.github.io/claree/branding/002/): cool greys, one deep blue; IBM Plex Serif and IBM Plex Sans; nearly square corners; a square beside the name in spaced capitals.
3. [Ochre](https://softersoftware.github.io/claree/branding/003/): neutral greys, one muted ochre; Literata and Public Sans; rounder corners; a dot beside the name.

The project owner chose **slate**.

### Refined, tried, agreed

Slate was refined: every colour given its role, a darker blue when pointed at, borders and no shadows, a filled button for the one action, an accent bar above the header, a visible focus. The colours no screen used were dropped. It was tried on the platform's screens, and **agreed by the project owner** the same day.

Kept in [`docs/branding/`](../../branding/README.md), and applied to every screen (#68).
