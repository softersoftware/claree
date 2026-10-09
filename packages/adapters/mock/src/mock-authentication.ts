import type { Server } from 'node:http'
import type { Authentication } from '@claree/domain'
import type { Account } from './accounts'
import { serveGitHubPages } from './github-pages'
import { type Files, inMemoryProjectFiles } from './in-memory-project-files'

const servers = ((globalThis as { githubPages?: Map<number, Server> }).githubPages ??= new Map())

/** Signs in to one of `accounts`, chosen on mock GitHub pages served on `port` from the first sign-in. */
export const mockAuthentication = (
  accounts: readonly Account[],
  projects: Readonly<Record<string, Files>>,
  { appName, port }: { readonly appName: string; readonly port: number },
): Authentication => ({
  start(callback, state) {
    if (!servers.has(port)) servers.set(port, serveGitHubPages(accounts, appName, port))
    return `http://localhost:${port}/login?${new URLSearchParams({ callback, state })}`
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
