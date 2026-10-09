import type { TheirProjects } from '@claree/domain'

/** Someone invented, and what the mock adapters find for them. */
export interface FictionalPerson {
  readonly id: string
  readonly name: string
  readonly projects: TheirProjects
}

/** The people the mock adapters sign in, one for each thing signing in can find. */
export const people: readonly FictionalPerson[] = [
  {
    id: 'ana',
    name: 'Ana Ruiz',
    projects: { found: 'some', addresses: ['https://example.org/medito', 'https://example.org/allotments'] },
  },
  { id: 'tom', name: 'Tom Okafor', projects: { found: 'not let in' } },
  { id: 'lea', name: 'Léa Martin', projects: { found: 'none recognises them' } },
]
