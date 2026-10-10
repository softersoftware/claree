import type { Authentication } from '@claree/domain';
import type { Account } from './accounts';
import { type Files, inMemoryProjectFiles } from './in-memory-project-files';

/** Signs in to one of `accounts`, chosen on the mock GitHub pages served at `signInPagesAt`. */
export const mockAuthentication = (
  accounts: readonly Account[],
  projects: Readonly<Record<string, Files>>,
  signInPagesAt: string,
): Authentication => ({
  start(callback, state) {
    return new URL(`login.html?${new URLSearchParams({ callback, state })}`, signInPagesAt).href;
  },
  async finish(query) {
    const account = accounts.find(({ login }) => login === query.login);
    if (account === undefined) return undefined;
    const addresses = account.projects.found === 'some' ? account.projects.addresses : [];
    return {
      name: account.name,
      async projects() {
        return account.projects;
      },
      projectFiles: inMemoryProjectFiles(
        Object.fromEntries(Object.entries(projects).filter(([address]) => addresses.includes(address))),
      ),
    };
  },
});
