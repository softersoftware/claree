import { type KeptFiles, type ProjectFiles, repositoryLink } from '@claree/domain'

/** The files of one project, by their path from its root. */
export type Files = Readonly<Record<string, string>>

/**
 * Projects held in memory, by address. Nothing is read from anywhere else, so
 * the platform runs with no outside service.
 */
export const inMemoryProjectFiles = (projects: Readonly<Record<string, Files>>): ProjectFiles => ({
  async open(address) {
    const files = projects[address]
    if (files === undefined) return undefined
    const kept = new Map(Object.entries(files))
    const opened: KeptFiles = {
      address,
      link: repositoryLink(address),
      async read(path) {
        return kept.get(path)
      },
    }
    return opened
  },
})
