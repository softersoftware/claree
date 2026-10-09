import type { AvailableProject, Project } from '@claree/domain'
import { claree } from './claree'
import type { Files } from './in-memory-project-files'
import { medito } from './medito'

/** The projects the mock adapters serve, invented, by address. */
export const projects: Readonly<Record<string, Files>> = {
  'https://example.org/medito': {
    'README.md': '# Medito\n\nBooking sessions at a meditation centre.\n',
  },
}

/** The projects the prototype holds, as they are read and written there. */
export const held: readonly Project[] = [claree, medito]

/** What the platform would find where someone keeps their projects. */
export const found: readonly AvailableProject[] = [
  {
    id: claree.id,
    name: claree.name,
    owner: 'ben',
    address: 'https://github.com/softersoftware/claree',
    isPublic: true,
    guardians: ['ben'],
  },
  {
    id: medito.id,
    name: medito.name,
    owner: 'ben',
    address: 'https://example.org/medito',
    isPublic: false,
    guardians: ['ben'],
  },
]
