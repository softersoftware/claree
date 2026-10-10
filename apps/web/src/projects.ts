import { notFound } from '@tanstack/react-router';
import { type Account, type AvailableProject, mayChange, mayOpen, type Project } from '@claree/domain';
import { mockProjects } from '@claree/mock-adapters';

/** Sketches and prototypes share one site, and so one storage: each stores its own under its path. */
const prefix = import.meta.env.BASE_URL;

/** The projects, held in memory: changes last until the page is loaded again. */
export const { projectStore, arrivals } = mockProjects(async () => ({
  get: (name) => localStorage.getItem(prefix + name) ?? undefined,
  set: (name, value) => localStorage.setItem(prefix + name, value),
  delete: (name) => localStorage.removeItem(prefix + name),
}));

export type Opened = {
  account?: Account;
  found: AvailableProject;
  project: Project;
  /** Changing anything means saying who you are, and being recognised. */
  writable: boolean;
};

/** What was found for this person, whether or not the platform can open it. */
export const findProject = async (projectId: string, account?: Account): Promise<AvailableProject | undefined> =>
  (await projectStore.available(account)).find((project) => project.id === projectId);

/** Opening a project: who is here, what they may see, and what they may change. */
export const open = async (projectId: string): Promise<Opened> => {
  const account = await arrivals.whoIsHere();
  const found = await findProject(projectId, account);
  if (!found || !mayOpen(found, account)) throw notFound();
  const project = await projectStore.load(projectId);
  if (!project) throw notFound();
  return { account, found, project, writable: mayChange(found, account) };
};

/** A file the sketch serves itself, such as a workshop's documents: its address under the sketch's own. */
export const served = (location: string): string =>
  location.startsWith('/') ? `${import.meta.env.BASE_URL}${location.slice(1)}` : location;
