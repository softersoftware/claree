import { describe, expect, it } from 'vitest'
import { mockAdapters } from '@claree/mock-adapters'
import { platform } from './platform'
import { storedCookies, storedSessions } from './in-browser'

const ports = mockAdapters({ signInPagesAt: 'http://platform/github/' })

/** A browser, as far as the server sees one: the cookies it keeps between requests. */
const browser = (app: { request(path: string, init?: RequestInit): Response | Promise<Response> }) => {
  const jar = new Map<string, string>()
  const send = async (path: string, body?: unknown) => {
    const response = await app.request(path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: {
        cookie: [...jar].map(([name, value]) => `${name}=${value}`).join('; '),
        ...(body === undefined ? {} : { 'content-type': 'application/json' }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    for (const cookie of response.headers.getSetCookie()) {
      const [name = '', value = ''] = cookie.split(';')[0]?.split('=') ?? []
      if (/max-age=0/i.test(cookie)) jar.delete(name)
      else jar.set(name, value)
    }
    return response
  }
  return {
    send,
    async signIn(login: string) {
      const { address } = (await (await send('/api/sign-in', { callback: 'http://platform/sign-in/callback' })).json()) as {
        address: string
      }
      const state = new URL(address).searchParams.get('state') ?? ''
      return send('/api/sign-in/callback', { login, state })
    },
  }
}

describe('the server', () => {
  it('signs a person in, and opens their projects', async () => {
    const ana = browser(platform(ports))
    expect(await (await ana.signIn('ana-ruiz')).json()).toEqual({ name: 'Ana Ruiz' })
    expect(await (await ana.send('/api/user')).json()).toEqual({ name: 'Ana Ruiz' })
    expect(await (await ana.send('/api/projects')).json()).toEqual({
      found: 'some',
      projects: [
        {
          address: 'https://github.com/medito-centre/medito',
          name: 'Medito',
          scope: 'Booking sessions at a meditation centre.',
        },
        {
          address: 'https://github.com/greenlane-gardens/allotments',
          name: 'Allotments',
          scope: 'Sharing plots, tools and harvests between the gardeners of one site.',
        },
      ],
    })
    expect(await (await ana.send('/api/projects/medito-centre/medito')).json()).toEqual({
      name: 'Medito',
      scope: 'Booking sessions at a meditation centre.',
      address: 'https://github.com/medito-centre/medito',
      link: 'https://github.com/medito-centre/medito',
    })
  })

  it('says why a person has no project', async () => {
    const tom = browser(platform(ports))
    await tom.signIn('tom-okafor')
    expect(await (await tom.send('/api/projects')).json()).toEqual({ found: 'not installed' })
  })

  it('opens nothing to someone not signed in', async () => {
    const nobody = browser(platform(ports))
    expect((await nobody.send('/api/user')).status).toBe(401)
    expect((await nobody.send('/api/projects')).status).toBe(401)
    expect((await nobody.send('/api/projects/medito-centre/medito')).status).toBe(401)
  })

  it('opens no project that is not the user’s', async () => {
    const ana = browser(platform(ports))
    await ana.signIn('ana-ruiz')
    expect((await ana.send('/api/projects/medito-centre/elsewhere')).status).toBe(404)
  })

  it('signs nobody in who comes back with another state', async () => {
    const app = platform(ports)
    const ana = browser(app)
    await ana.send('/api/sign-in', { callback: 'http://platform/sign-in/callback' })
    expect((await ana.send('/api/sign-in/callback', { login: 'ana-ruiz', state: 'forged' })).status).toBe(401)
    expect((await browser(app).send('/api/sign-in/callback', { login: 'ana-ruiz', state: '' })).status).toBe(401)
  })

  it('sends a person to sign in only through an address a browser can open', async () => {
    const ana = browser(platform(ports))
    expect((await ana.send('/api/sign-in', { callback: 'javascript:alert(1)' })).status).toBe(400)
  })

  it('signs out', async () => {
    const ana = browser(platform(ports))
    await ana.signIn('ana-ruiz')
    expect((await ana.send('/api/sign-out', {})).status).toBe(204)
    expect((await ana.send('/api/user')).status).toBe(401)
  })
})

describe('the server in a browser', () => {
  const storage = () => {
    const items = new Map<string, string>()
    return {
      getItem: (key: string) => items.get(key) ?? null,
      setItem: (key: string, value: string) => void items.set(key, value),
      removeItem: (key: string) => void items.delete(key),
    }
  }
  const inBrowser = (kept: ReturnType<typeof storage>) =>
    platform(ports, {
      cookies: storedCookies(kept, 'p/'),
      sessions: storedSessions(ports.authentication, kept, 'p/'),
    })
  const signIn = async (app: ReturnType<typeof inBrowser>, login: string) => {
    const json = { 'content-type': 'application/json' }
    const start = await app.request('/api/sign-in', {
      method: 'POST',
      headers: json,
      body: JSON.stringify({ callback: 'http://platform/' }),
    })
    const state = new URL(((await start.json()) as { address: string }).address).searchParams.get('state')
    return app.request('/api/sign-in/callback', { method: 'POST', headers: json, body: JSON.stringify({ login, state }) })
  }

  it('keeps a person signed in after the page is reloaded', async () => {
    const kept = storage()
    expect((await signIn(inBrowser(kept), 'ana-ruiz')).status).toBe(200)
    expect(await (await inBrowser(kept).request('/api/user')).json()).toEqual({ name: 'Ana Ruiz' })
  })

  it('forgets them when they sign out', async () => {
    const kept = storage()
    await signIn(inBrowser(kept), 'ana-ruiz')
    await inBrowser(kept).request('/api/sign-out', { method: 'POST' })
    expect((await inBrowser(kept).request('/api/user')).status).toBe(401)
  })
})
