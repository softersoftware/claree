import type { Authentication, User } from '@claree/domain'
import type { Cookies, Sessions } from './sessions'
import { randomId } from './sessions'

/** The part of the browser's `localStorage` the server uses. */
export type BrowserStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

/**
 * Cookies, when the server runs in the browser (ADR 0016): a browser drops
 * `Cookie` and `Set-Cookie` from the requests and responses a page makes, so
 * they are kept in storage instead, under `prefix`.
 */
export const storedCookies = (storage: BrowserStorage, prefix: string): Cookies => ({
  get: (_, name) => storage.getItem(`${prefix}cookie:${name}`) ?? undefined,
  set: (_, name, value) => storage.setItem(`${prefix}cookie:${name}`, value),
  delete: (_, name) => storage.removeItem(`${prefix}cookie:${name}`),
})

/**
 * Sessions, when the server runs in the browser: what a user signed in with is
 * kept in storage, and signs them in again after the page is reloaded. Only
 * an authentication that accepts the same query twice can be kept this way.
 */
export const storedSessions = (authentication: Authentication, storage: BrowserStorage, prefix: string): Sessions => {
  const users = new Map<string, User>()
  const key = (id: string) => `${prefix}session:${id}`
  return {
    async user(id) {
      const known = users.get(id)
      if (known !== undefined) return known
      const query = storage.getItem(key(id))
      const user = query === null ? undefined : await authentication.finish(JSON.parse(query))
      if (user !== undefined) users.set(id, user)
      return user
    },
    async remember(user, query) {
      const id = randomId()
      users.set(id, user)
      storage.setItem(key(id), JSON.stringify(query))
      return id
    },
    async forget(id) {
      users.delete(id)
      storage.removeItem(key(id))
    },
  }
}
