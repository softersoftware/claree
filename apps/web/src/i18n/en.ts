/** What the platform says, in English. Never what a project says: that is never translated. */
export const en = {
  description: 'Making digital tools with the people who need them.',
  signingIn: {
    signIn: 'Sign in with GitHub',
    needed: 'You need to be signed in to access your projects.',
    failed: 'Signing in failed. Try again.',
    signOut: 'Sign out',
  },
  projects: {
    title: 'Projects',
    count: (count: number) => `Projects — ${count}`,
    notInstalled: (product: string) =>
      `${product} is not installed on any of your GitHub organisations. An owner of the organisation can install it.`,
    install: (product: string) => `Install ${product}`,
    noneReadable: (product: string) =>
      `${product} is installed, but on no repository you can read. Ask an owner of the organisation for access.`,
    unopened: (address: string) => `“${address}” is not one of your projects.`,
  },
  overview: {
    scope: 'Scope',
    repository: 'Repository',
  },
  nav: {
    overview: 'Overview',
    workshops: 'Workshops',
    domains: 'Domains',
    prototypes: 'Prototypes',
    features: 'Features',
    milestones: 'Milestones',
    branding: 'Branding',
  },
  workshops: {
    none: 'No workshops yet.',
    noDocuments: 'No documents.',
    kinds: {
      slides: 'Slides',
      video: 'Video',
      recording: 'Recording',
      notes: 'Notes',
      report: 'Report',
      transcript: 'Transcript',
      sketch: 'Sketch',
    },
  },
  domains: {
    none: 'No domains yet.',
  },
  prototypes: {
    none: 'No prototypes yet.',
    tryIt: 'Try it',
  },
  features: {
    none: 'No features yet.',
    noStories: 'No stories yet.',
    stories: (count: number) => `Stories — ${count}`,
    more: (count: number) => `${count} more`,
  },
  stories: {
    states: { 'to do': 'To do', 'in progress': 'In progress', done: 'Done' },
    released: (version: string) => `Released in ${version}`,
    blockedBy: (stories: string) => `Blocked by ${stories}`,
    sizes: (value: string, effort: string) => `Value ${value} · Effort ${effort}`,
    value: 'Business value',
    effort: 'Effort',
    unsized: 'Not set',
    milestone: 'Milestone',
    noMilestone: 'None',
    release: 'Release',
    releasedOn: (version: string, date: string) => `${version}, ${date}`,
    notReleased: 'Not yet',
    blockedByTitle: 'Blocked by',
    notBlocked: 'Nothing.',
    mockUp: 'Mock-up',
    noMockUp: 'No mock-up yet.',
    plan: 'Plan of implementation',
    noPlan: 'No plan yet.',
  },
  milestones: {
    none: 'No milestones yet.',
    noStories: 'No stories yet.',
    reached: 'Reached',
    totals: (value: number, effort: number | undefined) =>
      `Value ${value} · Effort ${effort ?? 'unknown, some stories have none'}`,
    groups: { 'to do': 'To do', 'in progress': 'In progress', done: 'Done', released: 'Released' },
  },
  branding: {
    none: 'No branding yet.',
    logo: 'Logo',
    typography: 'Typography',
    sample: 'The quick brown fox jumps over the lazy dog.',
    typefaceFor: (use: string) => `For ${use}`,
    colours: 'Colours',
    files: 'Other files',
  },
  language: 'Language',
  failed: 'Something went wrong. Try again.',
};

export type Strings = typeof en;
