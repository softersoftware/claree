import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { adapters } from '@/adapters'
import { remember } from '@/session'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = Object.fromEntries(url.searchParams)
  const jar = await cookies()
  const state = jar.get('sign-in-state')?.value
  jar.delete({ name: 'sign-in-state', path: '/sign-in' })
  const user = state !== undefined && query.state === state ? await adapters.authentication.finish(query) : undefined
  if (user !== undefined) await remember(user)
  return NextResponse.redirect(new URL(user === undefined ? '/?signed-in=no' : '/projects', url), 303)
}
