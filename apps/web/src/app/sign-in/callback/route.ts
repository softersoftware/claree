import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { adapters } from '@/adapters'
import { remember } from '@/session'

/** Where a person comes back from signing in. Without the state they left with, nobody is signed in. */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const proof = Object.fromEntries(url.searchParams)
  const jar = await cookies()
  const state = jar.get('sign-in-state')?.value
  jar.delete({ name: 'sign-in-state', path: '/sign-in' })
  const who = state !== undefined && proof.state === state ? await adapters.signingIn.finish(proof) : undefined
  if (who !== undefined) await remember(who)
  return NextResponse.redirect(new URL(who === undefined ? '/?signed-in=no' : '/', url), 303)
}
