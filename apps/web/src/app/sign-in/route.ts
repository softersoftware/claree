import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { adapters } from '@/adapters'
import { publicOrigin } from '@/public-origin'
import { randomId } from '@/session'

/** `state` is known only to this browser, and checked when it comes back. */
export async function POST(request: Request) {
  const state = randomId()
  ;(await cookies()).set('sign-in-state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/sign-in',
    maxAge: 600,
  })
  const origin = publicOrigin(request)
  return NextResponse.redirect(new URL(adapters.authentication.start(`${origin}/sign-in/callback`, state), origin), 303)
}
