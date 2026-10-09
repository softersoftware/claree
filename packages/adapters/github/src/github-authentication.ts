import type { Authentication, ProjectList } from '@claree/domain'
import { type Api, apiAs, type GitHubOptions, tokenFor, web } from './github-api'
import { githubProjectFiles } from './github-project-files'

/** Every page of a list GitHub gives a hundred at a time. */
const all = async <T>(get: Api, path: string, key: string): Promise<T[] | undefined> => {
  const items: T[] = []
  for (let page = 1; ; page++) {
    const response = await get(`${path}${path.includes('?') ? '&' : '?'}per_page=100&page=${page}`)
    if (!response.ok) return undefined
    const batch = ((await response.json()) as Record<string, T[]>)[key] ?? []
    items.push(...batch)
    if (batch.length < 100) return items
  }
}

const projectsOf = async (get: Api, appSlug: string): Promise<ProjectList> => {
  const installations = (await all<{ id: number }>(get, '/user/installations', 'installations')) ?? []
  if (installations.length === 0) return { found: 'not installed', installAt: `${web}/apps/${appSlug}/installations/new` }
  const addresses = new Set<string>()
  for (const { id } of installations)
    for (const { html_url } of (await all<{ html_url: string }>(get, `/user/installations/${id}/repositories`, 'repositories')) ?? [])
      addresses.add(html_url)
  return addresses.size === 0 ? { found: 'none readable' } : { found: 'some', addresses: [...addresses] }
}

/** Signing in with the platform's GitHub App, in the name of the person signed in (ADR 0010). */
export const githubAuthentication = (options: GitHubOptions): Authentication => ({
  start(callback, state) {
    if (options.clientId === '') throw new Error('GITHUB_APP_CLIENT_ID is not set.')
    return `${web}/login/oauth/authorize?${new URLSearchParams({ client_id: options.clientId, redirect_uri: callback, state })}`
  },
  async finish(query) {
    if (!query.code) return undefined
    const token = await tokenFor(options, { code: query.code })
    if (token === undefined) return undefined
    const get = apiAs(options, token)
    const response = await get('/user')
    if (!response.ok) return undefined
    const user = (await response.json()) as { login: string; name: string | null }
    return {
      name: user.name || user.login,
      projects: () => projectsOf(get, options.appSlug),
      projectFiles: githubProjectFiles(get),
    }
  },
})
