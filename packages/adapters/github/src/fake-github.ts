/** GitHub, as far as the adapter speaks to it, held in memory for the tests. */

type Files = Readonly<Record<string, string>>
type Account = { name: string | null; installations: number[]; reads: Set<string> }
type Token = { login: string; refresh: string; expired: boolean }

export const fakeGitHub = () => {
  const accounts = new Map<string, Account>()
  const repositories = new Map<string, { installation: number; commits: Files[] }>()
  const codes = new Map<string, string>()
  const tokens = new Map<string, Token>()
  let count = 0
  const issue = (login: string) => {
    const access = `token-${++count}`
    tokens.set(access, { login, refresh: `refresh-${count}`, expired: false })
    return { access_token: access, expires_in: 28800, refresh_token: `refresh-${count}` }
  }
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

  const fetch = async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
    const url = new URL(input instanceof Request ? input.url : input)
    if (url.href === 'https://github.com/login/oauth/access_token') {
      const body = new URLSearchParams(String(init?.body))
      if (body.get('client_secret') !== 'secret') return json({ error: 'incorrect_client_credentials' })
      if (body.get('grant_type') === 'refresh_token') {
        const old = [...tokens].find(([, token]) => token.refresh === body.get('refresh_token'))
        if (old === undefined) return json({ error: 'bad_refresh_token' })
        tokens.delete(old[0])
        return json(issue(old[1].login))
      }
      const login = codes.get(body.get('code') ?? '')
      codes.delete(body.get('code') ?? '')
      return login === undefined ? json({ error: 'bad_verification_code' }) : json(issue(login))
    }

    const token = tokens.get(new Headers(init?.headers).get('authorization')?.replace('Bearer ', '') ?? '')
    if (url.host !== 'api.github.com' || token === undefined || token.expired) return json({}, 401)
    const account = accounts.get(token.login)
    if (account === undefined) return json({}, 401)
    const page = Number(url.searchParams.get('page') ?? 1)
    const path = url.pathname

    if (path === '/user') return json({ login: token.login, name: account.name })
    if (path === '/user/installations')
      return json({ installations: page === 1 ? account.installations.map((id) => ({ id })) : [] })
    const installation = /^\/user\/installations\/(\d+)\/repositories$/.exec(path)
    if (installation)
      return json({
        repositories:
          page === 1
            ? [...repositories]
                .filter(([name, { installation: id }]) => id === Number(installation[1]) && account.reads.has(name))
                .map(([name]) => ({ html_url: `https://github.com/${name}` }))
            : [],
      })

    const [, owner, name, rest = ''] = /^\/repos\/([^/]+)\/([^/]+)(\/.*)?$/.exec(path) ?? []
    const fullName = `${owner}/${name}`
    const repository = repositories.get(fullName)
    if (repository === undefined || !account.reads.has(fullName)) return json({ message: 'Not Found' }, 404)
    const sha = (index: number) => `sha-${index}`
    if (rest === '') return json({ default_branch: 'main' })
    if (rest === '/branches/main') return json({ commit: { sha: sha(repository.commits.length - 1) } })
    if (rest.startsWith('/contents/')) {
      const files = repository.commits[Number(url.searchParams.get('ref')?.replace('sha-', ''))]
      const file = files?.[decodeURIComponent(rest.slice('/contents/'.length))]
      return file === undefined
        ? json({ message: 'Not Found' }, 404)
        : new Response(file, { headers: { 'content-type': 'application/vnd.github.raw; charset=utf-8' } })
    }
    return json({ message: 'Not Found' }, 404)
  }

  return {
    fetch,
    account(login: string, name: string | null, installations: number[] = []) {
      accounts.set(login, { name, installations, reads: new Set() })
    },
    repository(fullName: string, installation: number, files: Files, readers: string[]) {
      repositories.set(fullName, { installation, commits: [files] })
      for (const login of readers) accounts.get(login)?.reads.add(fullName)
    },
    push(fullName: string, files: Files) {
      repositories.get(fullName)?.commits.push(files)
    },
    /** The code GitHub sends back to the callback once this account agrees. */
    codeFor(login: string) {
      const code = `code-${++count}`
      codes.set(code, login)
      return code
    },
    expireTokens() {
      for (const token of tokens.values()) token.expired = true
    },
  }
}
