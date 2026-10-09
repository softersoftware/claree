import { type Language, languages } from '@/language'

export function LanguageSelector({ current, label }: { current: Language; label: string }) {
  return (
    <form action="/language" method="post" aria-label={label} className="flex items-center gap-2 text-sm">
      {Object.entries(languages).map(([language, name]) =>
        language === current ? (
          <span key={language} lang={language} className="font-semibold">
            {name}
          </span>
        ) : (
          <button
            key={language}
            type="submit"
            name="language"
            value={language}
            lang={language}
            className="text-muted underline-offset-2 hover:text-ink hover:underline"
          >
            {name}
          </button>
        ),
      )}
    </form>
  )
}
