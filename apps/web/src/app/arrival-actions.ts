'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { LOCALE, PROJECT_LANGUAGE } from '@/cookie-names'
import { isLocale } from '@/i18n'
import { thePerson } from '@claree/mock-adapters'
import { adapters } from '@/adapters'

export async function arrive() {
  await adapters.arrivals.arrive(thePerson)
  redirect('/')
}

export async function leave() {
  await adapters.arrivals.leave()
  redirect('/')
}

/** An address, as it was typed: the scheme and a trailing slash change nothing. */
const plainly = (address: string) =>
  address.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '')

/** Adding a project at its address. A public one is added without saying who you are. */
export async function openByAddress(formData: FormData) {
  const typed = plainly(String(formData.get('address') ?? ''))
  const account = await adapters.arrivals.whoIsHere()
  const found = (await adapters.projectStore.available(account)).find((project) => {
    const address = plainly(project.address)
    return address === typed || address.endsWith(`/${typed}`)
  })
  if (!found) redirect(`/?unknown=${encodeURIComponent(typed)}`)
  await adapters.arrivals.addProject(found.id)
  redirect(`/projects/${found.id}`)
}

/** Removing one from this person's own list. The project itself loses nothing. */
export async function removeProject(formData: FormData) {
  await adapters.arrivals.removeProject(String(formData.get('projectId') ?? ''))
  redirect('/')
}

const forAYear = { path: '/', maxAge: 60 * 60 * 24 * 365 } as const

/** The language the platform speaks to this person. A convenience, like everything the browser keeps. */
export async function chooseLocale(formData: FormData) {
  const locale = formData.get('locale')
  if (isLocale(locale)) (await cookies()).set(LOCALE, locale, forAYear)
}

/** Whether the platform speaks the language of the project being read, instead of that one. */
export async function useProjectLanguage(formData: FormData) {
  const follow = formData.get('follow') === 'yes' ? 'yes' : 'no'
  ;(await cookies()).set(PROJECT_LANGUAGE, follow, forAYear)
}
