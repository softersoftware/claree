import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { adapters } from '@/adapters'
import { randomId } from '@/session'

/** Sends the person to sign in, with a state only their browser knows, checked when they come back. */
export async function POST(request: Request) {
  const state = randomId()
  ;(await cookies()).set('sign-in-state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/sign-in',
    maxAge: 600,
  })
  const callback = new URL('/sign-in/callback', request.url).href
  return NextResponse.redirect(new URL(adapters.signingIn.start(callback, state), request.url), 303)
}
