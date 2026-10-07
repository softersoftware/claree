import type { Ports } from '@claree/domain'
import { inMemoryProjectFiles } from './in-memory-project-files'
import { projects } from './projects'

export * from './in-memory-project-files'

/** Every port, served from memory with invented projects, and no outside service. */
export const mockAdapters = (): Ports => ({
  projectFiles: inMemoryProjectFiles(projects),
})
