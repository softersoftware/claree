import { thePerson } from '@claree/mock-adapters';
import { arrivals, projectStore } from '@/projects';
import { router } from '@/router';

/** After who is here, or their projects, changed: the page shows it again. */
const reload = async () => {
  await router.navigate({ to: '/' });
  await router.invalidate();
};

export async function arrive() {
  await arrivals.arrive(thePerson);
  await reload();
}

export async function leave() {
  await arrivals.leave();
  await reload();
}

/** An address, as it was typed: the scheme and a trailing slash change nothing. */
const plainly = (address: string) =>
  address
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '');

/** Adding a project at its address. A public one is added without saying who you are. */
export async function openByAddress(formData: FormData) {
  const typed = plainly(String(formData.get('address') ?? ''));
  const account = await arrivals.whoIsHere();
  const found = (await projectStore.available(account)).find((project) => {
    const address = plainly(project.address);
    return address === typed || address.endsWith(`/${typed}`);
  });
  if (!found) return router.navigate({ to: '/', search: { unknown: typed } });
  await arrivals.addProject(found.id);
  await router.navigate({ to: '/projects/$projectId', params: { projectId: found.id } });
}

/** Removing one from this person's own list. The project itself loses nothing. */
export async function removeProject(formData: FormData) {
  await arrivals.removeProject(String(formData.get('projectId') ?? ''));
  await reload();
}
