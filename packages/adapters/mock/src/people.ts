import type { TheirProjects } from '@claree/domain'

/** Someone invented, and what the mock adapters find for them. */
export interface FictionalPerson {
  /** What they sign in with, as on GitHub. */
  readonly login: string
  readonly name: string
  readonly projects: TheirProjects
}

/** The people the mock adapters sign in, one for each thing signing in can find. */
export const people: readonly FictionalPerson[] = [
  {
    login: 'ana-ruiz',
    name: 'Ana Ruiz',
    projects: {
      found: 'some',
      addresses: ['https://github.com/medito-centre/medito', 'https://github.com/greenlane-gardens/allotments'],
    },
  },
  { login: 'tom-okafor', name: 'Tom Okafor', projects: { found: 'not let in' } },
  { login: 'lea-martin', name: 'Léa Martin', projects: { found: 'none recognises them' } },
]
