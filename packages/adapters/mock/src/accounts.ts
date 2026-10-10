import type { ProjectList } from '@claree/domain';

export type Account = {
  /** What the person signs in with, as on GitHub. */
  readonly login: string;
  readonly name: string;
  readonly projects: ProjectList;
};

/** One account for each list of projects a user can have. */
export const accounts: readonly Account[] = [
  {
    login: 'ana-ruiz',
    name: 'Ana Ruiz',
    projects: {
      found: 'some',
      addresses: ['https://github.com/medito-centre/medito', 'https://github.com/greenlane-gardens/allotments'],
    },
  },
  { login: 'tom-okafor', name: 'Tom Okafor', projects: { found: 'not installed' } },
  { login: 'lea-martin', name: 'Léa Martin', projects: { found: 'none readable' } },
];
