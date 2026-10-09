import { cookies } from 'next/headers'
import { isLanguage } from '@/language'
import { redirectTo } from '@/public-origin'

/** Keeps the language chosen, and goes back to the page it was chosen on. */
export async function POST(request: Request) {
  const language = (await request.formData()).get('language')
  if (isLanguage(language))
    (await cookies()).set('language', language, { path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 })
  const referer = request.headers.get('referer')
  const back = referer === null ? '/' : new URL(referer).pathname + new URL(referer).search
  return redirectTo(back.startsWith('/') && !back.startsWith('//') ? back : '/')
}
