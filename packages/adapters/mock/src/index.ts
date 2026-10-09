import type { Ports } from '@claree/domain'
import { accounts } from './accounts'
import { mockAuthentication } from './mock-authentication'
import { projects } from './projects'

export * from './in-memory-project-files'

/** Every port, with invented accounts and projects in memory. GitHub's pages are imitated on `githubPort`. */
export const mockAdapters = ({ appName, githubPort = 3001 }: { appName: string; githubPort?: number }): Ports => ({
  authentication: mockAuthentication(accounts, projects, { appName, port: githubPort }),
})
