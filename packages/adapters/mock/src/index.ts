import type { Ports } from '@claree/domain';
import { accounts } from './accounts';
import { browserArrivals, type Jar } from './browser-arrivals';
import { found, held } from './held-projects';
import { inMemoryProjectStore } from './in-memory-project-store';
import { githubSignInPages } from './github-pages';
import { mockAuthentication } from './mock-authentication';
import { projects } from './projects';

export * from './browser-arrivals';
export * from './in-memory-project-files';

/** Every port, with invented accounts and projects in memory. GitHub's pages are imitated at `signInPagesAt`. */
export const mockAdapters = ({ signInPagesAt }: { signInPagesAt: string }): Ports => ({
  authentication: mockAuthentication(accounts, projects, signInPagesAt),
});

/** The mock GitHub pages, as files by name, to serve at the address given to `mockAdapters`. */
export const mockSignInFiles = (appName: string) => githubSignInPages(accounts, appName);

/** The invented projects of a sketch, held in memory, and who is here, stored by the visitor's browser through `jar`. */
export const mockProjects = (jar: () => Promise<Jar>) => ({
  projectStore: inMemoryProjectStore(found, held),
  arrivals: browserArrivals(jar),
});
