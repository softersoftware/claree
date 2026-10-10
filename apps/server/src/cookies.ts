import type { Context } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import type { CookieOptions } from 'hono/utils/cookie';

/** A random id, impossible to guess, with what both Node and browsers provide (ADR 0016). */
export const randomId = () =>
  btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

/** What the server stores in the browser between two requests. */
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
