import type { Ports } from '@claree/domain'
import { fictionalSigningIn } from './fictional-signing-in'
import { people } from './people'
import { projects } from './projects'

export * from './fictional-signing-in'
export * from './in-memory-project-files'
export * from './people'

/**
 * Every port, served from memory with invented people and projects, and no
 * outside service. Signing in is choosing one of `people` at `chooseAt`.
 */
export const mockAdapters = (chooseAt: string): Ports => ({
  signingIn: fictionalSigningIn(people, projects, chooseAt),
})
