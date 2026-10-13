import type { Project } from './project';

/** A project just started: one workshop, its sketch, and nothing written yet. */
export const allotments: Project = {
  workshops: [
    {
      date: '2026-10-02',
      title: 'General presentation',
      documents: [
        {
          kind: 'notes',
          title: 'Notes',
          link: 'https://github.com/greenlane-gardens/allotments/blob/main/docs/workshops/20261002%20general%20presentation/notes.md',
        },
        {
          kind: 'sketch',
          title: 'Sketch of the whole scope',
          link: 'https://greenlane-gardens.github.io/allotments/sketches/001/',
        },
      ],
    },
  ],
  domains: [],
  prototypes: [],
  features: [],
  stories: [],
  milestones: [],
  releases: [],
};
