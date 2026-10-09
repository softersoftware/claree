import type { Ports } from '@claree/domain'
import { type Jar, browserArrivals } from './browser-arrivals'
import { inMemoryProjectFiles } from './in-memory-project-files'
import { inMemoryProjectStore } from './in-memory-project-store'
import { found, held, projects } from './projects'

export * from './browser-arrivals'
export * from './in-memory-project-files'
export * from './in-memory-project-store'

/**
 * Every port, served from memory with invented projects, and no outside
 * service. Who is here is kept by the visitor's own browser, reached through
 * `jar`.
 */
export const mockAdapters = (jar: () => Promise<Jar>): Ports => ({
  projectFiles: inMemoryProjectFiles(projects),
  projectStore: inMemoryProjectStore(found, held),
  arrivals: browserArrivals(jar),
})
