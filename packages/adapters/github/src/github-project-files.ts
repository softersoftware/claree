import { type ProjectFiles, repositoryLink } from '@claree/domain'
import { type Api, web } from './github-api'

const repositoryAt = new RegExp(`^${web.replace(/\./g, '\\.')}/([\\w.-]+)/([\\w.-]+?)(?:\\.git)?/?$`)

/** The repositories a user can read, at the commit of their default branch when opened. */
export const githubProjectFiles = (get: Api): ProjectFiles => ({
  async open(address) {
    const [, owner = '', name = ''] = repositoryAt.exec(address) ?? []
    if (owner === '') return undefined
    const repository = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`
    const found = await get(repository)
    if (!found.ok) return undefined
    const { default_branch } = (await found.json()) as { default_branch: string }
    const branch = await get(`${repository}/branches/${encodeURIComponent(default_branch)}`)
    if (!branch.ok) return undefined
    const { commit } = (await branch.json()) as { commit: { sha: string } }

    return {
      address,
      link: repositoryLink(address),
      async read(path) {
        const segments = path.split('/')
        if (segments.some((part) => part === '' || part === '.' || part === '..')) return undefined
        const file = await get(
          `${repository}/contents/${segments.map(encodeURIComponent).join('/')}?ref=${commit.sha}`,
          'application/vnd.github.raw',
        )
        if (!file.ok || file.headers.get('content-type')?.startsWith('application/json')) return undefined
        return file.text()
      },
    }
  },
})
