import type { SigningIn } from '@claree/domain'
import { type Files, inMemoryProjectFiles } from './in-memory-project-files'
import type { FictionalPerson } from './people'

/**
 * Signing in as one of a few invented people, with no outside service. The
 * person is chosen at `chooseAt`, which stands where the real sign-in page
 * would, and comes back to the callback as `person`.
 */
export const fictionalSigningIn = (
  people: readonly FictionalPerson[],
  projects: Readonly<Record<string, Files>>,
  chooseAt: string,
): SigningIn => ({
  start(callback, state) {
    return `${chooseAt}?${new URLSearchParams({ callback, state })}`
  },
  async finish(proof) {
    const person = people.find(({ id }) => id === proof.person)
    if (person === undefined) return undefined
    const theirs = person.projects.found === 'some' ? person.projects.addresses : []
    return {
      participant: { name: person.name },
      async projects() {
        return person.projects
      },
      projectFiles: inMemoryProjectFiles(
        Object.fromEntries(Object.entries(projects).filter(([address]) => theirs.includes(address))),
      ),
    }
  },
})
