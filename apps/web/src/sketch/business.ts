/** What a project holds beyond its README, as the sketch invents it, and the rules of the domains it applies. */

export type Agreement = { by: string; on: string };

export type Role = 'domain expert' | 'project owner' | 'maker';

export type Craft = 'UX designer' | 'UI designer' | 'architect' | 'coder' | 'business analyst' | 'tester';

export type Participant = { name: string; roles: Role[]; crafts: Craft[] };

export type DocumentKind = 'slides' | 'video' | 'recording' | 'notes' | 'report' | 'transcript' | 'sketch';

export type WorkshopDocument = { id: string; kind: DocumentKind; title: string; where?: string; text?: string };

export type Workshop = { id: string; date: string; title: string; documents: WorkshopDocument[] };

export type Term = { name: string; definition: string };

export type Rule = { id: string; text: string; agreement?: Agreement };

export type Question = { id: string; text: string; asked: string; answer?: string };

export type Domain = {
  id: string;
  name: string;
  description: string;
  glossary: Term[];
  rules: Rule[];
  questions: Question[];
};

export type Prototype = { version: string; where: string; validation?: Agreement };

export type Size = 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL';

export const sizes: readonly Size[] = ['XXS', 'XS', 'S', 'M', 'L', 'XL'];

/** What a size stands for: the gaps widen, as the larger something is, the less precisely it is known. */
export const weight: Readonly<Record<Size, number>> = { XXS: 1, XS: 2, S: 3, M: 5, L: 8, XL: 13 };

export type Status = 'to do' | 'in progress' | 'done';

export type Feature = { id: string; name: string };

export type Story = {
  id: string;
  number: number;
  feature: string;
  person: string;
  intention: string;
  reason: string;
  value?: Size;
  effort?: Size;
  status: Status;
  blockedBy: string[];
  version?: string;
  mockUp?: string;
  plan?: string;
};

export type Version = {
  name: string;
  demonstration?: { where: string; validation?: Agreement };
  deployed?: string;
};

export type Feedback = { id: string; date: string; from: string; text: string; workshop?: string };

export type Colour = { name: string; value: string; for: string };

export type Direction = { number: string; name: string; where: string };

export type Branding = {
  personality: string[];
  name?: string;
  tagline?: string;
  tone?: string;
  directions: Direction[];
  chosen?: string;
  colours: Colour[];
  typography?: string;
  agreement?: Agreement;
};

export type Business = {
  language: 'en' | 'fr';
  participants: Participant[];
  branding: Branding;
  workshops: Workshop[];
  domains: Domain[];
  prototypes: Prototype[];
  features: Feature[];
  stories: Story[];
  versions: Version[];
  feedback: Feedback[];
};

export const today = () => new Date().toISOString().slice(0, 10);

export const domainExperts = (business: Business) =>
  business.participants.filter((participant) => participant.roles.includes('domain expert'));

/** Workshops are read by date, the most recent first. */
export const byDate = <T extends { date: string }>(items: readonly T[]) =>
  [...items].sort((a, b) => b.date.localeCompare(a.date));

export const openQuestions = (business: Business) =>
  business.domains.flatMap((domain) => domain.questions.filter((question) => question.answer === undefined));

/** A feature is in progress as soon as one of its stories is, and done when all of them are. */
export const featureStatus = (business: Business, feature: string): Status => {
  const stories = business.stories.filter((story) => story.feature === feature);
  if (stories.length > 0 && stories.every((story) => story.status === 'done')) return 'done';
  if (stories.some((story) => story.status !== 'to do')) return 'in progress';
  return 'to do';
};

export const ratio = (stories: readonly Story[]) => {
  const value = stories.reduce((sum, story) => sum + (story.value ? weight[story.value] : 0), 0);
  const effort = stories.reduce((sum, story) => sum + (story.effort ? weight[story.effort] : 0), 0);
  return { value, effort, ratio: effort === 0 ? undefined : value / effort };
};

export const storiesOf = (business: Business, version: string | undefined) =>
  business.stories.filter((story) => story.version === version);

export const blockers = (business: Business, story: Story) =>
  business.stories.filter((other) => story.blockedBy.includes(other.id) && other.status !== 'done');

/** Within a version, what blocks nothing comes first, then the best value for its effort. */
export const inOrder = (business: Business, stories: readonly Story[]) =>
  [...stories].sort((a, b) => {
    const blocked = blockers(business, a).length - blockers(business, b).length;
    if (blocked !== 0) return blocked;
    return (ratio([b]).ratio ?? 0) - (ratio([a]).ratio ?? 0);
  });

/** A version is deployed once all its stories are done, and its demonstration validated. */
export const whyNotDeployable = (business: Business, version: Version): 'stories' | 'demonstration' | undefined => {
  if (storiesOf(business, version.name).some((story) => story.status !== 'done')) return 'stories';
  if (!version.demonstration?.validation) return 'demonstration';
  return undefined;
};

export type Step =
  | 'workshops'
  | 'domains'
  | 'prototypes'
  | 'story mapping'
  | 'version planning'
  | 'refinement'
  | 'implementation'
  | 'deployment'
  | 'feedback';

export const steps: readonly Step[] = [
  'workshops',
  'domains',
  'prototypes',
  'story mapping',
  'version planning',
  'refinement',
  'implementation',
  'deployment',
  'feedback',
];

/** The next version: the first not deployed. */
export const nextVersion = (business: Business) => business.versions.find((version) => !version.deployed);

/** Where the project is in the cycle, from what it holds. */
export const currentStep = (business: Business): Step => {
  const next = nextVersion(business);
  if (business.workshops.length === 0) return 'workshops';
  if (business.domains.length === 0) return 'domains';
  if (!next) return business.feedback.length > 0 ? 'feedback' : 'domains';
  const prototype = business.prototypes.find((prototype) => prototype.version === next.name);
  if (!prototype?.validation) return 'prototypes';
  const stories = storiesOf(business, next.name);
  if (stories.length === 0) return business.stories.length === 0 ? 'story mapping' : 'version planning';
  if (stories.every((story) => story.status === 'done')) return 'deployment';
  if (stories.some((story) => story.status !== 'to do')) return 'implementation';
  if (stories.some((story) => !story.value || !story.effort)) return 'story mapping';
  return 'refinement';
};
