import { describe, expect, it } from 'vitest';
import type { Authentication, Session } from '@claree/domain';
import { mockAdapters } from '@claree/mock-adapters';
import { apiServer } from './api-server';
import { storedCookies, storedKey } from './in-browser';

const ports = mockAdapters({ signInPagesAt: 'http://platform/github/' });

const randomKey = () => crypto.getRandomValues(new Uint8Array(32));

type Server = { request(path: string, init?: RequestInit): Response | Promise<Response> };

/** A browser, as far as the server sees one: the cookies it stores between requests. */
const fakeBrowser = (first: Server) => {
  let app = first;
  const jar = new Map<string, string>();
  const send = async (path: string, body?: unknown) => {
    const response = await app.request(path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: {
        cookie: [...jar].map(([name, value]) => `${name}=${value}`).join('; '),
        ...(body === undefined ? {} : { 'content-type': 'application/json' }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    for (const cookie of response.headers.getSetCookie()) {
      const [name = '', value = ''] = cookie.split(';')[0]?.split('=') ?? [];
      if (/max-age=0/i.test(cookie)) jar.delete(name);
      else jar.set(name, value);
    }
    return response;
  };
  return {
    send,
    /** The same browser, now reaching another server: restarted, or another instance. */
    reach(server: Server) {
      app = server;
    },
    async signIn(login: string) {
      const { address } = (await (
        await send('/api/sign-in', { callback: 'http://platform/sign-in/callback' })
      ).json()) as {
        address: string;
      };
      const state = new URL(address).searchParams.get('state') ?? '';
      return send('/api/sign-in/callback', { login, state });
    },
  };
};

describe('the server', () => {
  it('signs a person in, and opens their projects', async () => {
    const browser = fakeBrowser(apiServer(ports, { key: randomKey() }));
    expect(await (await browser.signIn('ana-ruiz')).json()).toEqual({ name: 'Ana Ruiz' });
    expect(await (await browser.send('/api/user')).json()).toEqual({ name: 'Ana Ruiz' });
    expect(await (await browser.send('/api/projects')).json()).toEqual({
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
    });
    expect(await (await browser.send('/api/projects/medito-centre/medito')).json()).toEqual({
      name: 'Medito',
      scope: 'Booking sessions at a meditation centre.',
      address: 'https://github.com/medito-centre/medito',
      link: 'https://github.com/medito-centre/medito',
    });
  });

  it('says why a person has no project', async () => {
    const browser = fakeBrowser(apiServer(ports, { key: randomKey() }));
    await browser.signIn('tom-okafor');
    expect(await (await browser.send('/api/projects')).json()).toEqual({ found: 'not installed' });
  });

  it('opens nothing to someone not signed in', async () => {
    const browser = fakeBrowser(apiServer(ports, { key: randomKey() }));
    expect((await browser.send('/api/user')).status).toBe(401);
    expect((await browser.send('/api/projects')).status).toBe(401);
    expect((await browser.send('/api/projects/medito-centre/medito')).status).toBe(401);
  });

  it('opens no project that is not the user’s', async () => {
    const browser = fakeBrowser(apiServer(ports, { key: randomKey() }));
    await browser.signIn('ana-ruiz');
    expect((await browser.send('/api/projects/medito-centre/elsewhere')).status).toBe(404);
  });

  it('signs nobody in who comes back with another state', async () => {
    const app = apiServer(ports, { key: randomKey() });
    const browser = fakeBrowser(app);
    await browser.send('/api/sign-in', { callback: 'http://platform/sign-in/callback' });
    expect((await browser.send('/api/sign-in/callback', { login: 'ana-ruiz', state: 'forged' })).status).toBe(401);
    expect((await fakeBrowser(app).send('/api/sign-in/callback', { login: 'ana-ruiz', state: '' })).status).toBe(401);
  });

  it('sends a person to sign in only through an address a browser can open', async () => {
    const browser = fakeBrowser(apiServer(ports, { key: randomKey() }));
    expect((await browser.send('/api/sign-in', { callback: 'javascript:alert(1)' })).status).toBe(400);
  });

  it('signs out', async () => {
    const browser = fakeBrowser(apiServer(ports, { key: randomKey() }));
    await browser.signIn('ana-ruiz');
    expect((await browser.send('/api/sign-out', {})).status).toBe(204);
    expect((await browser.send('/api/user')).status).toBe(401);
  });
});

describe('a session', () => {
  /** An authentication whose token is renewed whenever the user's projects are listed. */
  const renewing = () => {
    const revoked: string[] = [];
    const sessionAt = (version: number): Session => {
      let current = version;
      return {
        user: {
          name: 'Ana Ruiz',
          async projects() {
            current++;
            return { found: 'none readable' };
          },
          projectFiles: { open: async () => undefined },
        },
        credentials: () => `v${current}`,
      };
    };
    const authentication: Authentication = {
      start: (callback, state) => `${callback}?${new URLSearchParams({ state })}`,
      finish: async () => sessionAt(1),
      resume: async (credentials) => (/^v\d+$/.test(credentials) ? sessionAt(Number(credentials.slice(1))) : undefined),
      revoke: async (credentials) => void revoked.push(credentials),
    };
    return { authentication, revoked };
  };

  it('outlives the server: another one with the same key knows who is signed in', async () => {
    const key = randomKey();
    const browser = fakeBrowser(apiServer(ports, { key }));
    await browser.signIn('ana-ruiz');
    browser.reach(apiServer(ports, { key }));
    expect(await (await browser.send('/api/user')).json()).toEqual({ name: 'Ana Ruiz' });
  });

  it('is read only with the key it was sealed with', async () => {
    const browser = fakeBrowser(apiServer(ports, { key: randomKey() }));
    await browser.signIn('ana-ruiz');
    browser.reach(apiServer(ports, { key: randomKey() }));
    expect((await browser.send('/api/user')).status).toBe(401);
  });

  it('sends back the token the authentication renewed while answering', async () => {
    const { authentication } = renewing();
    const browser = fakeBrowser(apiServer({ authentication }, { key: randomKey() }));
    await browser.signIn('ana-ruiz');
    const renewal = await browser.send('/api/projects');
    expect(renewal.headers.getSetCookie().some((cookie) => cookie.startsWith('session='))).toBe(true);
    const unchanged = await browser.send('/api/user');
    expect(unchanged.headers.getSetCookie()).toEqual([]);
  });

  it('is revoked when the person signs out', async () => {
    const { authentication, revoked } = renewing();
    const browser = fakeBrowser(apiServer({ authentication }, { key: randomKey() }));
    await browser.signIn('ana-ruiz');
    await browser.send('/api/sign-out', {});
    expect(revoked).toEqual(['v1']);
  });
});

describe('the server in a browser', () => {
  const fakeStorage = () => {
    const items = new Map<string, string>();
    return {
      getItem: (key: string) => items.get(key) ?? null,
      setItem: (key: string, value: string) => void items.set(key, value),
      removeItem: (key: string) => void items.delete(key),
    };
  };
  const inBrowser = (storage: ReturnType<typeof fakeStorage>) =>
    apiServer(ports, { key: storedKey(storage, 'p/'), cookies: storedCookies(storage, 'p/') });
  const signIn = async (app: ReturnType<typeof inBrowser>, login: string) => {
    const json = { 'content-type': 'application/json' };
    const start = await app.request('/api/sign-in', {
      method: 'POST',
      headers: json,
      body: JSON.stringify({ callback: 'http://platform/' }),
    });
    const state = new URL(((await start.json()) as { address: string }).address).searchParams.get('state');
    return app.request('/api/sign-in/callback', {
      method: 'POST',
      headers: json,
      body: JSON.stringify({ login, state }),
    });
  };

  it('leaves a person signed in after the page is reloaded', async () => {
    const storage = fakeStorage();
    expect((await signIn(inBrowser(storage), 'ana-ruiz')).status).toBe(200);
    expect(await (await inBrowser(storage).request('/api/user')).json()).toEqual({ name: 'Ana Ruiz' });
  });

  it('forgets them when they sign out', async () => {
    const storage = fakeStorage();
    await signIn(inBrowser(storage), 'ana-ruiz');
    await inBrowser(storage).request('/api/sign-out', { method: 'POST' });
    expect((await inBrowser(storage).request('/api/user')).status).toBe(401);
  });
});
