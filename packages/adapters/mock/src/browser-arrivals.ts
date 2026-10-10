import type { Account, Arrivals } from '@claree/domain';

/** What the visitor's own browser stores: a few named values. */
export type Jar = {
  get(name: string): string | undefined;
  set(name: string, value: string): void;
  delete(name: string): void;
};

/** The names under which the browser stores who is here, and the projects they added. */
export const WHO_IS_HERE = 'claree.who';
export const ADDED_PROJECTS = 'claree.added';

/** The one invented account the prototype knows. */
export const thePerson: Account = { handle: 'ben', name: 'Ben Layet' };

/**
 * Arrivals stored by the visitor's own browser: who they are and which projects
 * they added. No outside service, and throwing it away costs a project nothing.
 */
export const browserArrivals = (jar: () => Promise<Jar>): Arrivals => {
  const added = async () => {
    const stored = (await jar()).get(ADDED_PROJECTS);
    return new Set(stored ? stored.split(',').filter(Boolean) : []);
  };
  /** The added projects, changed and written back where they live: the browser. */
  const store = async (change: (projects: Set<string>) => void) => {
    const projects = await added();
    change(projects);
    (await jar()).set(ADDED_PROJECTS, [...projects].join(','));
  };
  return {
    async whoIsHere() {
      return (await jar()).get(WHO_IS_HERE) === thePerson.handle ? thePerson : undefined;
    },
    async arrive(account) {
      (await jar()).set(WHO_IS_HERE, account.handle);
    },
    async leave() {
      (await jar()).delete(WHO_IS_HERE);
    },
    async addedProjects() {
      return [...(await added())];
    },
    async addProject(projectId) {
      await store((projects) => projects.add(projectId));
    },
    async removeProject(projectId) {
      await store((projects) => projects.delete(projectId));
    },
  };
};
