import { describe, expect, it } from 'vitest'
import { authenticationContract, projectFilesContract } from '@claree/domain/contracts'
import { githubAuthentication } from './github-authentication'
import { fakeGitHub } from './fake-github'

const options = (github: ReturnType<typeof fakeGitHub>) => ({
  clientId: 'client',
  clientSecret: 'secret',
  appSlug: 'platform',
  fetch: github.fetch as typeof fetch,
})

const withAccounts = () => {
  const github = fakeGitHub()
  github.account('ana-ruiz', 'Ana Ruiz', [1])
  github.account('tom-okafor', null)
  github.account('lea-martin', 'Léa Martin', [1])
  github.repository('medito-centre/medito', 1, { 'README.md': '# Medito' }, ['ana-ruiz'])
  return github
}

const logins = { 'with projects': 'ana-ruiz', 'not installed': 'tom-okafor', 'none readable': 'lea-martin' } as const

authenticationContract('GitHub', async () => {
  const github = withAccounts()
  return {
    authentication: githubAuthentication(options(github)),
    async signedIn(account, state) {
      return { code: github.codeFor(logins[account]), state }
    },
    refused(state) {
      return { error: 'access_denied', state }
    },
  }
})

projectFilesContract('GitHub', async () => {
  const github = withAccounts()
  const user = await githubAuthentication(options(github)).finish({ code: github.codeFor('ana-ruiz') })
  if (user === undefined) throw new Error('nobody signed in')
  let count = 0
  return {
    projectFiles: user.projectFiles,
    async repositoryWith(files) {
      const name = `medito-centre/project-${++count}`
      github.repository(name, 1, files, ['ana-ruiz'])
      return `https://github.com/${name}`
    },
    async changeRepository(address, files) {
      github.push(address.replace('https://github.com/', ''), files)
    },
    nowhere: 'https://github.com/medito-centre/nothing',
  }
})

describe('signing in with GitHub', () => {
  it('sends a person to the app on GitHub, with the callback and the state', () => {
    const start = new URL(githubAuthentication(options(fakeGitHub())).start('http://platform/callback', 's1'))
    expect(start.href.startsWith('https://github.com/login/oauth/authorize?')).toBe(true)
    expect(start.searchParams.get('client_id')).toBe('client')
    expect(start.searchParams.get('redirect_uri')).toBe('http://platform/callback')
    expect(start.searchParams.get('state')).toBe('s1')
  })

  it('names the user by their login when they have no name', async () => {
    const github = withAccounts()
    expect((await githubAuthentication(options(github)).finish({ code: github.codeFor('tom-okafor') }))?.name).toBe(
      'tom-okafor',
    )
  })

  it('links to where the platform is installed when it is installed nowhere', async () => {
    const github = withAccounts()
    const tom = await githubAuthentication(options(github)).finish({ code: github.codeFor('tom-okafor') })
    expect(await tom?.projects()).toEqual({
      found: 'not installed',
      installAt: 'https://github.com/apps/platform/installations/new',
    })
  })

  it('signs nobody in with a code GitHub refuses, or a wrong secret', async () => {
    const github = withAccounts()
    expect(await githubAuthentication(options(github)).finish({ code: 'forged' })).toBeUndefined()
    const code = github.codeFor('ana-ruiz')
    expect(await githubAuthentication({ ...options(github), clientSecret: 'wrong' }).finish({ code })).toBeUndefined()
  })

  it('renews an expired token once, and reads again', async () => {
    const github = withAccounts()
    const ana = await githubAuthentication(options(github)).finish({ code: github.codeFor('ana-ruiz') })
    github.expireTokens()
    const opened = await ana?.projectFiles.open('https://github.com/medito-centre/medito')
    expect(await opened?.read('README.md')).toBe('# Medito')
  })

  it('renews a token a minute before it expires, without waiting to be refused', async () => {
    const github = withAccounts()
    let now = 0
    const calls: string[] = []
    const watched: typeof fetch = async (input, init) => (calls.push(String(input)), github.fetch(input, init))
    const ana = await githubAuthentication({ ...options(github), fetch: watched, now: () => now }).finish({
      code: github.codeFor('ana-ruiz'),
    })
    now = 28800 * 1000 - 30_000
    calls.length = 0
    expect((await ana?.projects())?.found).toBe('some')
    expect(calls[0]).toBe('https://github.com/login/oauth/access_token')
  })
})
