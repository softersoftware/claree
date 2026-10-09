import { redirectTo } from '@/public-origin'
import { forget } from '@/session'

export async function POST() {
  await forget()
  return redirectTo('/')
}
