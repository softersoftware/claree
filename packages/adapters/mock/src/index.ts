import type { Ports } from '@claree/domain'
import { accounts } from './accounts'
import { mockAuthentication } from './mock-authentication'
import { projects } from './projects'

export * from './accounts'
export * from './in-memory-project-files'
export * from './mock-authentication'

/** Every port, with invented accounts and projects in memory. Accounts are chosen on `signInPage`. */
export const mockAdapters = (signInPage: string): Ports => ({
  authentication: mockAuthentication(accounts, projects, signInPage),
})
