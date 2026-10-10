import type { AvailableProject, Project } from '@claree/domain';
import { claree } from './claree';
import { medito } from './medito';

/** The projects a sketch holds, as they are read and written there. */
export const held: readonly Project[] = [claree, medito];

/** What the platform would find where someone has their projects. */
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
];
