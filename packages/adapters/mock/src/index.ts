import type { Ports } from '@claree/domain'
import { accounts } from './accounts'
import { githubSignInPages } from './github-pages'
import { mockAuthentication } from './mock-authentication'
import { projects } from './projects'

export * from './in-memory-project-files'

/** Every port, with invented accounts and projects in memory. GitHub's pages are imitated at `signInPagesAt`. */
export const mockAdapters = ({ signInPagesAt }: { signInPagesAt: string }): Ports => ({
  authentication: mockAuthentication(accounts, projects, signInPagesAt),
})

/** The mock GitHub pages, as files by name, to serve at the address given to `mockAdapters`. */
export const mockSignInPages = (appName: string) => githubSignInPages(accounts, appName)
