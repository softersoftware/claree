import type { Authentication, Session } from '@claree/domain';
import type { Account } from './accounts';
import { type Files, inMemoryProjectFiles } from './in-memory-project-files';

/** Signs in to one of `accounts`, chosen on the mock GitHub pages served at `signInPagesAt`. */
export const mockAuthentication = (
  accounts: readonly Account[],
  projects: Readonly<Record<string, Files>>,
  signInPagesAt: string,
): Authentication => {
  /** The session of the account with this login, which is its credentials. */
  const sessionOf = (login: unknown): Session | undefined => {
    const account = accounts.find((account) => account.login === login);
    if (account === undefined) return undefined;
    const addresses = account.projects.found === 'some' ? account.projects.addresses : [];
    return {
      user: {
        name: account.name,
        async projects() {
          return account.projects;
        },
        projectFiles: inMemoryProjectFiles(
          Object.fromEntries(Object.entries(projects).filter(([address]) => addresses.includes(address))),
        ),
      },
      credentials: () => JSON.stringify({ login: account.login }),
    };
  };

  return {
    start(callback, state) {
      return new URL(`login.html?${new URLSearchParams({ callback, state })}`, signInPagesAt).href;
    },
    async finish(query) {
      return sessionOf(query.login);
    },
    async resume(credentials) {
      try {
        return sessionOf((JSON.parse(credentials) as { login?: unknown }).login);
      } catch {
        return undefined;
      }
    },
    async revoke() {},
  };
};
