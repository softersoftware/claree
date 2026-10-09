import type { Files } from './in-memory-project-files'

/** The projects the mock adapters serve, invented, by address. */
export const projects: Readonly<Record<string, Files>> = {
  'https://github.com/medito-centre/medito': {
    'README.md': '# Medito\n\nBooking sessions at a meditation centre.\n',
  },
  'https://github.com/greenlane-gardens/allotments': {
    'README.md': '# Allotments\n\nSharing plots, tools and harvests between the gardeners of one site.\n',
  },
}
