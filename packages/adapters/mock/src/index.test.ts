import { describe, expect, it } from 'vitest'
import { type Jar, mockAdapters } from '.'

/** A browser that keeps its values for as long as the test runs. */
const browser = () => {
  const values = new Map<string, string>()
  const jar: Jar = {
    get: (name) => values.get(name),
    set: (name, value) => void values.set(name, value),
    delete: (name) => void values.delete(name),
  }
  return async () => jar
}

describe('the mock adapters', () => {
  it('open the invented projects', async () => {
    const opened = await mockAdapters(browser()).projectFiles.open('https://example.org/medito')
    expect(await opened?.read('README.md')).toContain('# Medito')
  })

  it('offer the public project to anyone, and the private one to the people it recognises', async () => {
    const { projectStore, arrivals } = mockAdapters(browser())
    expect((await projectStore.available()).map((project) => project.id)).toEqual(['claree'])
    const ben = { handle: 'ben', name: 'Ben Layet' }
    expect((await projectStore.available(ben)).map((project) => project.id)).toEqual(['claree', 'medito'])
    await arrivals.arrive(ben)
    expect(await arrivals.whoIsHere()).toEqual(ben)
  })

  it('keep the projects someone added, until they remove them', async () => {
    const { arrivals } = mockAdapters(browser())
    await arrivals.addProject('claree')
    await arrivals.addProject('medito')
    await arrivals.removeProject('claree')
    expect(await arrivals.addedProjects()).toEqual(['medito'])
  })
})
