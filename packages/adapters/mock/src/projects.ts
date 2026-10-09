import type { Files } from './in-memory-project-files'

/** The projects the mock adapters serve, invented, by address. */
export const projects: Readonly<Record<string, Files>> = {
  'https://example.org/medito': {
    'README.md': '# Medito\n\nBooking sessions at a meditation centre.\n',
  },
  'https://example.org/allotments': {
    'README.md': '# Allotments\n\nSharing plots, tools and harvests between the gardeners of one site.\n',
  },
}
