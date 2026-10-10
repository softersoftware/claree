import type { Cookies } from './cookies';

/** The part of the browser's `localStorage` the server uses. */
export type BrowserStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

/**
 * Cookies, when the server runs in the browser (ADR 0016): a browser drops
 * `Cookie` and `Set-Cookie` from the requests and responses a page makes, so
 * they are stored in `storage` instead, under `prefix`.
 */
export const storedCookies = (storage: BrowserStorage, prefix: string): Cookies => ({
  get: (_, name) => storage.getItem(`${prefix}cookie:${name}`) ?? undefined,
  set: (_, name, value) => storage.setItem(`${prefix}cookie:${name}`, value),
  delete: (_, name) => storage.removeItem(`${prefix}cookie:${name}`),
});

/**
 * The key a session's cookie is encrypted with, when the server runs in the
 * browser (ADR 0017): made on first use, and stored beside the cookies.
 */
export const storedKey = (storage: BrowserStorage, prefix: string): Uint8Array => {
  const stored = storage.getItem(`${prefix}key`);
  if (stored !== null) return Uint8Array.from(atob(stored), (character) => character.charCodeAt(0));
  const key = crypto.getRandomValues(new Uint8Array(32));
  storage.setItem(`${prefix}key`, btoa(String.fromCharCode(...key)));
  return key;
};
