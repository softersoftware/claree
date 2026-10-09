import type { Account, AvailableProject, Project, ProjectStore } from '@claree/domain'

/**
 * The projects held in memory, seeded with fictional data. Nothing is written
 * anywhere, so the prototype can be shown at any moment, by anyone, with no
 * consequence.
 */
export const inMemoryProjectStore = (
  found: readonly AvailableProject[],
  projects: readonly Project[],
): ProjectStore => {
  const held = new Map(projects.map((project) => [project.id, project]))
  return {
    async available(account?: Account) {
      return found.filter(
        (project) => project.isPublic || (account !== undefined && project.guardians.includes(account.handle)),
      )
    },
    async load(projectId: string) {
      return held.get(projectId)
    },
    async save(project: Project) {
      held.set(project.id, project)
    },
  }
}
