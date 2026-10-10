import type { Authentication, ProjectList, Session } from '@claree/domain';
import { api, type Api, apiAs, type GitHubOptions, type Token, tokenFor, web } from './github-api';
import { githubProjectFiles } from './github-project-files';

/** Every page of a list GitHub gives a hundred at a time. */
const all = async <T>(get: Api, path: string, key: string): Promise<T[] | undefined> => {
  const items: T[] = [];
  for (let page = 1; ; page++) {
    const response = await get(`${path}${path.includes('?') ? '&' : '?'}per_page=100&page=${page}`);
    if (!response.ok) return undefined;
    const batch = ((await response.json()) as Record<string, T[]>)[key] ?? [];
    items.push(...batch);
    if (batch.length < 100) return items;
  }
};

const projectsOf = async (get: Api, appSlug: string): Promise<ProjectList> => {
  const installations = (await all<{ id: number }>(get, '/user/installations', 'installations')) ?? [];
  if (installations.length === 0)
    return { found: 'not installed', installAt: `${web}/apps/${appSlug}/installations/new` };
  const addresses = new Set<string>();
  for (const { id } of installations)
    for (const { html_url } of (await all<{ html_url: string }>(
      get,
      `/user/installations/${id}/repositories`,
      'repositories',
    )) ?? [])
      addresses.add(html_url);
  return addresses.size === 0 ? { found: 'none readable' } : { found: 'some', addresses: [...addresses] };
};

/** A session's credentials: the user's name, and the token GitHub gave in their name (ADR 0017). */
type Credentials = { readonly name: string; readonly token: Token };

const credentialsIn = (text: string): Credentials | undefined => {
  try {
    const { name, token } = JSON.parse(text) as Partial<Credentials>;
    return typeof name === 'string' && typeof token?.access === 'string' ? { name, token } : undefined;
  } catch {
    return undefined;
  }
};

/** Signing in with the platform's GitHub App, in the name of the person signed in (ADR 0010). */
export const githubAuthentication = (options: GitHubOptions): Authentication => {
  const sessionOf = ({ name, token }: Credentials): Session => {
    const get = apiAs(options, token);
    return {
      user: { name, projects: () => projectsOf(get, options.appSlug), projectFiles: githubProjectFiles(get) },
      credentials: () => JSON.stringify({ name, token: get.token() }),
    };
  };

  return {
    start(callback, state) {
      if (options.clientId === '') throw new Error('GITHUB_APP_CLIENT_ID is not set.');
      return `${web}/login/oauth/authorize?${new URLSearchParams({ client_id: options.clientId, redirect_uri: callback, state })}`;
    },
    async finish(query) {
      if (!query.code) return undefined;
      const token = await tokenFor(options, { code: query.code });
      if (token === undefined) return undefined;
      const response = await apiAs(options, token)('/user');
      if (!response.ok) return undefined;
      const user = (await response.json()) as { login: string; name: string | null };
      return sessionOf({ name: user.name || user.login, token });
    },
    async resume(credentials) {
      const found = credentialsIn(credentials);
      return found === undefined ? undefined : sessionOf(found);
    },
    async revoke(credentials) {
      const found = credentialsIn(credentials);
      if (found === undefined) return;
      const { fetch: send = fetch } = options;
      await send(`${api}/applications/${encodeURIComponent(options.clientId)}/token`, {
        method: 'DELETE',
        headers: {
          accept: 'application/vnd.github+json',
          authorization: `Basic ${btoa(`${options.clientId}:${options.clientSecret}`)}`,
          'content-type': 'application/json',
          'user-agent': 'claree',
          'x-github-api-version': '2022-11-28',
        },
        body: JSON.stringify({ access_token: found.token.access }),
      });
    },
  };
};
