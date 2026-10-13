/**
 * What a project holds beyond its README, invented for the prototype of the MVP milestone: what its stories will
 * read from the project's repository and its issues.
 */

import { allotments } from './allotments';
import { medito } from './medito';

export type DocumentKind = 'slides' | 'video' | 'recording' | 'notes' | 'report' | 'transcript' | 'sketch';

export type WorkshopDocument = { kind: DocumentKind; title: string; link: string };

export type Workshop = { date: string; title: string; documents: WorkshopDocument[] };

/** A Markdown file of the project's repository, by its name in its folder. */
export type MarkdownFile = { file: string; text: string };

export type Prototype = { milestone: string; link: string };

export type Size = 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL';

/** What a size stands for, so that value and effort can be weighed against each other. */
export const weight: Readonly<Record<Size, number>> = { XXS: 1, XS: 2, S: 3, M: 5, L: 8, XL: 13 };

export type State = 'to do' | 'in progress' | 'done';

export type Feature = { number: number; name: string; description: string };

export type Story = {
  number: number;
  title: string;
  feature: number;
  person: string;
  intention: string;
  reason: string;
  value?: Size;
  effort?: Size;
  state: State;
  blockedBy: number[];
  mockUp?: string;
  plan?: string;
  /** The version of the release that carried it, once it has gone out. */
  release?: string;
};

/** Its stories, in the planned order. */
export type Milestone = { name: string; description: string; stories: number[] };

export type Release = { version: string; date: string };

export type Colour = { name: string; value: string; for: string };

export type Typeface = { name: string; for: string };

export type Branding = {
  files: MarkdownFile[];
  /** The logo, as an image a browser shows. */
  logo?: string;
  colours: Colour[];
  typefaces: Typeface[];
  /** Every other file of the branding, by name, and where it opens. */
  others: { file: string; link: string }[];
};

export type Project = {
  workshops: Workshop[];
  domains: MarkdownFile[];
  prototypes: Prototype[];
  features: Feature[];
  stories: Story[];
  milestones: Milestone[];
  releases: Release[];
  branding?: Branding;
};

const nothing: Project = {
  workshops: [],
  domains: [],
  prototypes: [],
  features: [],
  stories: [],
  milestones: [],
  releases: [],
};

export const projectAt = (address: string): Project =>
  ({
    'https://github.com/medito-centre/medito': medito,
    'https://github.com/greenlane-gardens/allotments': allotments,
  })[address] ?? nothing;

/** A story as its issue says it, in the project's words. */
export const sentence = (story: Story) =>
  `As a ${story.person}, I want to ${story.intention}, so that ${story.reason}.`;

/** The stories a story still waits for. */
export const blockers = (project: Project, story: Story) =>
  project.stories.filter((other) => story.blockedBy.includes(other.number) && other.state !== 'done');

/** Value and effort of stories together; effort is unknown while one of them has none. */
export const totals = (stories: readonly Story[]) => ({
  value: stories.reduce((sum, story) => sum + (story.value ? weight[story.value] : 0), 0),
  effort: stories.every((story) => story.effort)
    ? stories.reduce((sum, story) => sum + (story.effort ? weight[story.effort] : 0), 0)
    : undefined,
});

/** A milestone is reached once all its stories have gone out. */
export const reached = (stories: readonly Story[]) =>
  stories.length > 0 && stories.every((story) => story.release !== undefined);
