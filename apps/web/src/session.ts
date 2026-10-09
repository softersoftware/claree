import 'server-only'
import { randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import type { User } from '@claree/domain'

const cookie = 'session'

/** Kept in the server's memory only: a restart signs everyone out (ADR 0010). */
const sessions: Map<string, User> = ((globalThis as { sessions?: Map<string, User> }).sessions ??= new Map())

export const randomId = () => randomBytes(32).toString('base64url')

export const currentUser = async (): Promise<User | undefined> => {
  const id = (await cookies()).get(cookie)?.value
  return id === undefined ? undefined : sessions.get(id)
}

export const remember = async (user: User) => {
  const id = randomId()
  sessions.set(id, user)
  ;(await cookies()).set(cookie, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
}

export const forget = async () => {
  const jar = await cookies()
  const id = jar.get(cookie)?.value
  if (id !== undefined) sessions.delete(id)
  jar.delete(cookie)
}
