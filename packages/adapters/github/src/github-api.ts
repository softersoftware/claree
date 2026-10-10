export type GitHubOptions = {
  readonly clientId: string;
  readonly clientSecret: string;
  /** The app's name in its address on GitHub, for the link that installs it. */
  readonly appSlug: string;
  readonly fetch?: typeof fetch;
  readonly now?: () => number;
};

export const web = 'https://github.com';
const api = 'https://api.github.com';

type Token = { access: string; expiresAt?: number; refresh?: string };

/** Exchanges a code, or a refresh token, for a user token; nothing when GitHub refuses. */
export const tokenFor = async (
  options: GitHubOptions,
  grant: { code: string } | { refresh_token: string },
): Promise<Token | undefined> => {
  const { fetch: send = fetch, now = Date.now } = options;
  const response = await send(`${web}/login/oauth/access_token`, {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: options.clientId,
      client_secret: options.clientSecret,
      ...('code' in grant ? grant : { grant_type: 'refresh_token', ...grant }),
    }),
  });
  if (!response.ok) return undefined;
  const json = (await response.json()) as { access_token?: string; expires_in?: number; refresh_token?: string };
  if (!json.access_token) return undefined;
  return {
    access: json.access_token,
    expiresAt: json.expires_in === undefined ? undefined : now() + json.expires_in * 1000,
    refresh: json.refresh_token,
  };
};

/**
 * GitHub's REST API in the name of one user. The token is renewed a minute
 * before it expires, and once more when GitHub refuses it.
 */
export const apiAs = (options: GitHubOptions, first: Token) => {
  const { fetch: send = fetch, now = Date.now } = options;
  let token = first;

  const renew = async () => {
    if (token.refresh === undefined) return false;
    const renewed = await tokenFor(options, { refresh_token: token.refresh });
    if (renewed === undefined) return false;
    token = renewed;
    return true;
  };

  const get = (path: string, accept: string) =>
    send(`${api}${path}`, {
      headers: {
        accept,
        authorization: `Bearer ${token.access}`,
        'user-agent': 'claree',
        'x-github-api-version': '2022-11-28',
      },
    });

  return async (path: string, accept = 'application/vnd.github+json'): Promise<Response> => {
    if (token.expiresAt !== undefined && now() >= token.expiresAt - 60_000) await renew();
    const response = await get(path, accept);
    if (response.status === 401 && (await renew())) return get(path, accept);
    return response;
  };
};

export type Api = ReturnType<typeof apiAs>;
