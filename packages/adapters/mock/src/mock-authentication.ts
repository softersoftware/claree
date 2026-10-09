import type { Authentication } from '@claree/domain'
import type { Account } from './accounts'
import { type Files, inMemoryProjectFiles } from './in-memory-project-files'

/** Signs in to one of `accounts`, chosen on `signInPage`, which sends back the account's `login`. */
export const mockAuthentication = (
  accounts: readonly Account[],
  projects: Readonly<Record<string, Files>>,
  signInPage: string,
): Authentication => ({
  start(callback, state) {
    return `${signInPage}?${new URLSearchParams({ callback, state })}`
  },
  async finish(query) {
    const account = accounts.find(({ login }) => login === query.login)
    if (account === undefined) return undefined
    const addresses = account.projects.found === 'some' ? account.projects.addresses : []
    return {
      name: account.name,
      async projects() {
        return account.projects
      },
      projectFiles: inMemoryProjectFiles(
        Object.fromEntries(Object.entries(projects).filter(([address]) => addresses.includes(address))),
      ),
    }
  },
})
