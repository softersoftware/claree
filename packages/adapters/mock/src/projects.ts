import type { Files } from './in-memory-project-files'

/** The projects the mock adapters serve, invented, by address. */
export const projects: Readonly<Record<string, Files>> = {
  'https://example.org/medito': {
    'README.md': '# Medito\n\nBooking sessions at a meditation centre.\n',
  },
}
