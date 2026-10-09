import { cookies } from 'next/headers'
import { adapters } from '@/adapters'
import { redirectTo } from '@/public-origin'
import { remember } from '@/session'

export async function GET(request: Request) {
  const query = Object.fromEntries(new URL(request.url).searchParams)
  const jar = await cookies()
  const state = jar.get('sign-in-state')?.value
  jar.delete({ name: 'sign-in-state', path: '/sign-in' })
  const user = state !== undefined && query.state === state ? await adapters.authentication.finish(query) : undefined
  if (user !== undefined) await remember(user)
  return redirectTo(user === undefined ? '/?signed-in=no' : '/projects')
}
