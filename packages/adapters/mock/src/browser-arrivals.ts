import type { Account, Arrivals } from '@claree/domain'

/** What the visitor's own browser keeps: a few named values. */
export interface Jar {
  get(name: string): string | undefined
  set(name: string, value: string): void
  delete(name: string): void
}

/** The names under which the browser keeps who is here, and the projects they added. */
export const WHO_IS_HERE = 'claree.who'
export const ADDED_PROJECTS = 'claree.added'

/** The one invented account the prototype knows. */
export const thePerson: Account = { handle: 'ben', name: 'Ben Layet' }

/**
 * Arrivals kept by the visitor's own browser: who they are and which projects
 * they added. No outside service, and throwing it away costs a project nothing.
 */
export const browserArrivals = (jar: () => Promise<Jar>): Arrivals => {
  const added = async () => {
    const kept = (await jar()).get(ADDED_PROJECTS)
    return new Set(kept ? kept.split(',').filter(Boolean) : [])
  }
  /** The added projects, changed and written back where they live: the browser. */
  const keep = async (change: (projects: Set<string>) => void) => {
    const projects = await added()
    change(projects)
    ;(await jar()).set(ADDED_PROJECTS, [...projects].join(','))
  }
  return {
    async whoIsHere() {
      return (await jar()).get(WHO_IS_HERE) === thePerson.handle ? thePerson : undefined
    },
    async arrive(account) {
      ;(await jar()).set(WHO_IS_HERE, account.handle)
    },
    async leave() {
      ;(await jar()).delete(WHO_IS_HERE)
    },
    async addedProjects() {
      return [...(await added())]
    },
    async addProject(projectId) {
      await keep((projects) => projects.add(projectId))
    },
    async removeProject(projectId) {
      await keep((projects) => projects.delete(projectId))
    },
  }
}
