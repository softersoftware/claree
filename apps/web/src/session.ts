import { notFound } from 'next/navigation'
import { mayChange, mayOpen } from '@claree/domain'
import type { Account, AvailableProject, Project } from '@claree/domain'
import { adapters } from '@/adapters'

export interface Opened {
  account?: Account
  found: AvailableProject
  project: Project
  /** Changing anything means saying who you are, and being recognised. */
  writable: boolean
}

/** Opening a project: who is here, what they may see, and what they may change. */
export const open = async (projectId: string): Promise<Opened> => {
  const account = await adapters.arrivals.whoIsHere()
  const found = await findProject(projectId, account)
  if (!found || !mayOpen(found, account)) notFound()

  const project = await adapters.projectStore.load(projectId)
  if (!project) notFound()

  return { account, found, project, writable: mayChange(found, account) }
}

/** What was found for this person, whether or not the platform can open it. */
export const findProject = async (
  projectId: string,
  account?: Account,
): Promise<AvailableProject | undefined> =>
  (await adapters.projectStore.available(account)).find((project) => project.id === projectId)
