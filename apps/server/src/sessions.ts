import type { Context } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import type { CookieOptions } from 'hono/utils/cookie';
import type { User } from '@claree/domain';

/** A random id, impossible to guess, with what both Node and browsers provide (ADR 0016). */
export const randomId = () =>
  btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

/** Who is signed in, by the id their session cookie holds. */
export type Sessions = {
  user(id: string): Promise<User | undefined>;
  /** `query` is what the user came back to the callback with. */
  remember(user: User, query: Readonly<Record<string, string>>): Promise<string>;
  forget(id: string): Promise<void>;
};

/** Kept in the server's memory only: a restart signs everyone out (ADR 0010). */
export const inMemorySessions = (): Sessions => {
  const users = new Map<string, User>();
  return {
    async user(id) {
      return users.get(id);
    },
    async remember(user) {
      const id = randomId();
      users.set(id, user);
      return id;
    },
    async forget(id) {
      users.delete(id);
    },
  };
};

/** What the server keeps in the browser between two requests. */
export type Cookies = {
  get(c: Context, name: string): string | undefined;
  set(c: Context, name: string, value: string, options: CookieOptions): void;
  delete(c: Context, name: string, options: CookieOptions): void;
};

export const httpCookies: Cookies = {
  get: (c, name) => getCookie(c, name),
  set: (c, name, value, options) => setCookie(c, name, value, options),
  delete: (c, name, options) => void deleteCookie(c, name, options),
};
