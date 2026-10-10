import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { askedLocale, type Dictionary, dictionaryOf, isLocale, type Locale, localeIn } from '@/i18n';

/** What the visitor's own browser stores about how the platform speaks to them. */
const LOCALE = 'claree.locale';
const PROJECT_LANGUAGE = 'claree.project-language';

const stored = (name: string): string | null => {
  try {
    return localStorage.getItem(name);
  } catch {
    return null;
  }
};

const store = (name: string, value: string) => {
  try {
    localStorage.setItem(name, value);
  } catch {}
};

type Speaking = {
  locale: Locale;
  /** Whether this person asked to be spoken to in the language of what they read. */
  followsProject: boolean;
  choose(locale: Locale): void;
  followProject(follows: boolean): void;
};

const SpeakingContext = createContext<Speaking | undefined>(undefined);

/** What the person chose, else what their browser asks for, else English. */
export function SpeakingProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const chosen = stored(LOCALE);
    return isLocale(chosen) ? chosen : askedLocale();
  });
  const [followsProject, setFollowsProject] = useState(() => stored(PROJECT_LANGUAGE) !== 'no');
  useEffect(() => {
    document.documentElement.lang = locale;
    document.querySelector('meta[name=description]')?.setAttribute('content', dictionaryOf(locale).description);
  }, [locale]);
  const choose = (chosen: Locale) => {
    store(LOCALE, chosen);
    setLocale(chosen);
  };
  const followProject = (follows: boolean) => {
    store(PROJECT_LANGUAGE, follows ? 'yes' : 'no');
    setFollowsProject(follows);
  };
  return <SpeakingContext value={{ locale, followsProject, choose, followProject }}>{children}</SpeakingContext>;
}

export const useSpeaking = () => {
  const speaking = useContext(SpeakingContext);
  if (speaking === undefined) throw new Error('useSpeaking is used outside SpeakingProvider.');
  return speaking;
};

/** The locale and the words the platform uses outside any project. */
export const useDictionary = (): { locale: Locale; t: Dictionary } => {
  const { locale } = useSpeaking();
  return { locale, t: dictionaryOf(locale) };
};

/** The locale and the words the platform uses while a project written in `language` is read. */
export const useDictionaryIn = (language: string): { locale: Locale; t: Dictionary } => {
  const { locale, followsProject } = useSpeaking();
  const speaking = localeIn(language, locale, followsProject);
  return { locale: speaking, t: dictionaryOf(speaking) };
};
