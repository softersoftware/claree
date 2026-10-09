import 'server-only'
import { cookies, headers } from 'next/headers'
import { en } from '@/i18n/en'
import { fr } from '@/i18n/fr'

export const languages = { en: 'English', fr: 'Français' } as const

export type Language = keyof typeof languages

export const isLanguage = (value: unknown): value is Language => value === 'en' || value === 'fr'

/** The language chosen, kept in a cookie; until one is chosen, French if the browser asks for it first. */
export const currentLanguage = async (): Promise<Language> => {
  const chosen = (await cookies()).get('language')?.value
  if (isLanguage(chosen)) return chosen
  const first = (await headers()).get('accept-language')?.split(',')[0]?.trim().toLowerCase() ?? ''
  return first.startsWith('fr') ? 'fr' : 'en'
}

export const strings = async () => ((await currentLanguage()) === 'fr' ? fr : en)
