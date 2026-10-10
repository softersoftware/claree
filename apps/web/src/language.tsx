import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'
import { en, type Strings } from '@/i18n/en'
import { fr } from '@/i18n/fr'

export const languages = { en: 'English', fr: 'Français' } as const

export type Language = keyof typeof languages

const isLanguage = (value: unknown): value is Language => value === 'en' || value === 'fr'

/** The language chosen, kept in this browser; until one is chosen, French if the browser asks for it first. */
const chosenLanguage = (): Language => {
  try {
    const chosen = localStorage.getItem('language')
    if (isLanguage(chosen)) return chosen
  } catch {}
  return navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

const keep = (language: Language) => {
  try {
    localStorage.setItem('language', language)
  } catch {}
}

type CurrentLanguage = { language: Language; strings: Strings; choose(language: Language): void }

const LanguageContext = createContext<CurrentLanguage | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState(chosenLanguage)
  const strings = language === 'fr' ? fr : en
  useEffect(() => {
    document.documentElement.lang = language
    document.querySelector('meta[name=description]')?.setAttribute('content', strings.description)
  }, [language, strings])
  const choose = (chosen: Language) => {
    keep(chosen)
    setLanguage(chosen)
  }
  return <LanguageContext value={{ language, strings, choose }}>{children}</LanguageContext>
}

export const useLanguage = () => {
  const current = useContext(LanguageContext)
  if (current === undefined) throw new Error('useLanguage is used outside LanguageProvider.')
  return current
}
