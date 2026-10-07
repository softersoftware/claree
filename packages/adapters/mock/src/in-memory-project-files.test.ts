import { projectFilesContract } from '@claree/domain/contracts'
import { type Files, inMemoryProjectFiles } from './in-memory-project-files'

projectFilesContract('projects held in memory', async () => {
  const projects: Record<string, Files> = {}
  let count = 0
  return {
    projectFiles: inMemoryProjectFiles(projects),
    async keep(files) {
      const address = `https://example.org/project-${++count}`
      projects[address] = { ...files }
      return address
    },
    async change(address, files) {
      projects[address] = { ...files }
    },
    nowhere: 'https://example.org/nowhere',
  }
})
