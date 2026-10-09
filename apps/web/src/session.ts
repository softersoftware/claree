import 'server-only'
import { randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import type { SignedIn } from '@claree/domain'

const cookie = 'session'

/**
 * Who is signed in, by the id their browser holds. What signing in gave the
 * platform stays here, in the server's memory, and never reaches the browser;
 * a restart signs everyone out (ADR 0010).
 */
const sessions: Map<string, SignedIn> = ((globalThis as { sessions?: Map<string, SignedIn> }).sessions ??=
  new Map())

export const randomId = () => randomBytes(32).toString('base64url')

/** Who is signed in on this request; nothing when nobody is. */
export const signedIn = async (): Promise<SignedIn | undefined> => {
  const id = (await cookies()).get(cookie)?.value
  return id === undefined ? undefined : sessions.get(id)
}

export const remember = async (who: SignedIn) => {
  const id = randomId()
  sessions.set(id, who)
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
