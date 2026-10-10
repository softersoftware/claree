import { type Context, Hono } from 'hono'
import { validator } from 'hono/validator'
import { nameAndScope, type Ports } from '@claree/domain'
import { projectAddress } from './project-address'
import { type Cookies, httpCookies, inMemorySessions, randomId, type Sessions } from './sessions'

export type PlatformOptions = {
  readonly sessions?: Sessions
  readonly cookies?: Cookies
  /** Cookies sent over HTTPS only: in production, behind a proxy that speaks HTTPS for the server. */
  readonly secure?: boolean
}

const isQuery = (body: unknown): body is Record<string, string> =>
  typeof body === 'object' && body !== null && Object.values(body).every((value) => typeof value === 'string')

/**
 * The platform's server: what the application asks of it, as one function from
 * a `Request` to a `Response`, in Node as in a browser (ADR 0016).
 */
export const platform = (
  { authentication }: Ports,
  { sessions = inMemorySessions(), cookies = httpCookies, secure = false }: PlatformOptions = {},
) => {
  const session = { httpOnly: true, sameSite: 'Lax', secure, path: '/' } as const
  const signingIn = { ...session, path: '/api/sign-in' }

  const currentUser = async (c: Context) => {
    const id = cookies.get(c, 'session')
    return id === undefined ? undefined : sessions.user(id)
  }

  return new Hono()
    .basePath('/api')
    .get('/user', async (c) => {
      const user = await currentUser(c)
      return user === undefined ? c.json({}, 401) : c.json({ name: user.name }, 200)
    })
    .post(
      '/sign-in',
      validator('json', (body: { callback?: unknown }, c) =>
        typeof body.callback === 'string' && /^https?:\/\//.test(body.callback)
          ? { callback: body.callback }
          : c.json({}, 400),
      ),
      (c) => {
        // `state` is known only to this browser, and checked when it comes back.
        const state = randomId()
        cookies.set(c, 'sign-in-state', state, { ...signingIn, maxAge: 600 })
        return c.json({ address: authentication.start(c.req.valid('json').callback, state) }, 200)
      },
    )
    .post(
      '/sign-in/callback',
      validator('json', (body: unknown, c) => (isQuery(body) ? body : c.json({}, 400))),
      async (c) => {
        const query = c.req.valid('json')
        const state = cookies.get(c, 'sign-in-state')
        cookies.delete(c, 'sign-in-state', signingIn)
        const user = state !== undefined && query.state === state ? await authentication.finish(query) : undefined
        if (user === undefined) return c.json({}, 401)
        cookies.set(c, 'session', await sessions.remember(user, query), session)
        return c.json({ name: user.name }, 200)
      },
    )
    .post('/sign-out', async (c) => {
      const id = cookies.get(c, 'session')
      if (id !== undefined) await sessions.forget(id)
      cookies.delete(c, 'session', session)
      return c.body(null, 204)
    })
    .get('/projects', async (c) => {
      const user = await currentUser(c)
      if (user === undefined) return c.json({}, 401)
      const projects = await user.projects()
      if (projects.found !== 'some') return c.json(projects, 200)
      const cards = await Promise.all(
        projects.addresses.map(async (address) => {
          const repository = await user.projectFiles.open(address)
          return { address, ...nameAndScope(address, await repository?.read('README.md')) }
        }),
      )
      return c.json({ found: 'some' as const, projects: cards }, 200)
    })
    .get('/projects/:owner/:repository', async (c) => {
      const user = await currentUser(c)
      if (user === undefined) return c.json({}, 401)
      const { owner, repository } = c.req.param()
      const project = await user.projectFiles.open(projectAddress(owner, repository))
      if (project === undefined) return c.json({}, 404)
      const { name, scope } = nameAndScope(project.address, await project.read('README.md'))
      return c.json({ name, scope, address: project.address, link: project.link ?? null }, 200)
    })
}

/** The server's routes and answers, as types for the application's client. */
export type Platform = ReturnType<typeof platform>
