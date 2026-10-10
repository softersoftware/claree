import type { Dictionary } from './dictionary';
import { en } from './en';
import { fr } from './fr';

export type { Dictionary };

const dictionaries = { en, fr } satisfies Record<string, Dictionary>;

/** The language the platform speaks to someone. Never the language a project is written in. */
export type Locale = keyof typeof dictionaries;

export const locales = Object.keys(dictionaries) as Locale[];

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && Object.hasOwn(dictionaries, value);

/** What the browser asks for, else English. */
export const askedLocale = (): Locale =>
  navigator.languages.map((language) => language.slice(0, 2).toLowerCase()).find(isLocale) ?? 'en';

/**
 * While a project is being read: the language that project is written in, if
 * the person asked for that, else their own. Nothing is translated either way.
 */
export const localeIn = (language: string, locale: Locale, followsProject: boolean): Locale =>
  followsProject && isLocale(language) ? language : locale;

export const dictionaryOf = (locale: Locale): Dictionary => dictionaries[locale];

/**
 * The words a story is told with belong to the project, not to the reader: a
 * story written in French reads "En tant que…" whatever the platform speaks.
 */
export const storyWordsIn = (language: string): Dictionary['storyWords'] =>
  (isLocale(language) ? dictionaries[language] : en).storyWords;

/** A language, named in the language the platform is speaking — or as the project wrote it. */
export const languageName = (language: string, locale: Locale): string => {
  try {
    return new Intl.DisplayNames([locale], { type: 'language' }).of(language) ?? language;
  } catch {
    return String(language);
  }
};
