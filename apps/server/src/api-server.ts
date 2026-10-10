import { type Context, Hono } from 'hono';
import { validator } from 'hono/validator';
import { nameAndScope, type Ports, type Session } from '@claree/domain';
import { type Cookies, httpCookies, randomId } from './cookies';
import { projectAddress } from './project-address';
import { sealing, sessionLifetime } from './sealing';

export type ApiServerOptions = {
  /** The key the session's cookie is encrypted with (ADR 0017). */
  readonly key: Uint8Array;
  readonly cookies?: Cookies;
  /** Cookies sent over HTTPS only: in production, behind a proxy that speaks HTTPS for the server. */
  readonly secure?: boolean;
};

const isQuery = (body: unknown): body is Record<string, string> =>
  typeof body === 'object' && body !== null && Object.values(body).every((value) => typeof value === 'string');

/**
 * The platform's server: what the application asks of it, as one function from
 * a `Request` to a `Response`, in Node as in a browser (ADR 0016).
 */
export const apiServer = (
  { authentication }: Ports,
  { key, cookies = httpCookies, secure = false }: ApiServerOptions,
) => {
  const cookie = { httpOnly: true, sameSite: 'Lax', secure, path: '/' } as const;
  const signingIn = { ...cookie, path: '/api/sign-in' };
  const { seal, open } = sealing(key);

  const setSessionCookie = async (c: Context, session: Session) =>
    cookies.set(c, 'session', await seal(session.credentials()), { ...cookie, maxAge: sessionLifetime });

  return new Hono<{ Variables: { session: Session | undefined } }>()
    .basePath('/api')
    .use(async (c, next) => {
      const sealed = cookies.get(c, 'session');
      const credentials = sealed === undefined ? undefined : await open(sealed);
      const session = credentials === undefined ? undefined : await authentication.resume(credentials);
      c.set('session', session);
      await next();
      // GitHub renewed the token while answering: the old one no longer works, and the cookie holds the new one.
      if (session !== undefined && c.get('session') === session && session.credentials() !== credentials)
        await setSessionCookie(c, session);
    })
    .get('/user', async (c) => {
      const user = c.get('session')?.user;
      return user === undefined ? c.json({}, 401) : c.json({ name: user.name }, 200);
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
        const state = randomId();
        cookies.set(c, 'sign-in-state', state, { ...signingIn, maxAge: 600 });
        return c.json({ address: authentication.start(c.req.valid('json').callback, state) }, 200);
      },
    )
    .post(
      '/sign-in/callback',
      validator('json', (body: unknown, c) => (isQuery(body) ? body : c.json({}, 400))),
      async (c) => {
        const query = c.req.valid('json');
        const state = cookies.get(c, 'sign-in-state');
        cookies.delete(c, 'sign-in-state', signingIn);
        const session = state !== undefined && query.state === state ? await authentication.finish(query) : undefined;
        if (session === undefined) return c.json({}, 401);
        await setSessionCookie(c, session);
        c.set('session', session);
        return c.json({ name: session.user.name }, 200);
      },
    )
    .post('/sign-out', async (c) => {
      const session = c.get('session');
      if (session !== undefined) await authentication.revoke(session.credentials());
      cookies.delete(c, 'session', cookie);
      c.set('session', undefined);
      return c.body(null, 204);
    })
    .get('/projects', async (c) => {
      const user = c.get('session')?.user;
      if (user === undefined) return c.json({}, 401);
      const projects = await user.projects();
      if (projects.found !== 'some') return c.json(projects, 200);
      const cards = await Promise.all(
        projects.addresses.map(async (address) => {
          const repository = await user.projectFiles.open(address);
          return { address, ...nameAndScope(address, await repository?.read('README.md')) };
        }),
      );
      return c.json({ found: 'some' as const, projects: cards }, 200);
    })
    .get('/projects/:owner/:repository', async (c) => {
      const user = c.get('session')?.user;
      if (user === undefined) return c.json({}, 401);
      const { owner, repository } = c.req.param();
      const project = await user.projectFiles.open(projectAddress(owner, repository));
      if (project === undefined) return c.json({}, 404);
      const { name, scope } = nameAndScope(project.address, await project.read('README.md'));
      return c.json({ name, scope, address: project.address, link: project.link ?? null }, 200);
    });
};

/** The server's routes and answers, as types for the application's client. */
export type ApiServer = ReturnType<typeof apiServer>;
