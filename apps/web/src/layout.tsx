import { Link, Outlet, useLoaderData, useLocation, useNavigate } from 'react-router'
import { api } from '@/api'
import { languages, type Language, useLanguage } from '@/language'
import { productName } from '@/product'
import { Card, Page } from '@/ui'

/** The person signed in, or nobody. */
export const userLoader = async () => {
  const response = await api.user.$get()
  return response.ok ? response.json() : null
}

/** A link to the Projects page, except where it would lead nowhere new. */
function ProductName() {
  const className = 'text-sm font-semibold tracking-tight'
  return ['/', '/projects'].includes(useLocation().pathname) ? (
    <span className={className}>{productName}</span>
  ) : (
    <Link to="/projects" className={className}>
      {productName}
    </Link>
  )
}

function LanguageSelector() {
  const { language: current, strings: t, choose } = useLanguage()
  return (
    <div role="group" aria-label={t.language} className="flex items-center gap-2 text-sm">
      {Object.entries(languages).map(([language, name]) =>
        language === current ? (
          <span key={language} lang={language} className="font-semibold">
            {name}
          </span>
        ) : (
          <button
            key={language}
            type="button"
            lang={language}
            onClick={() => choose(language as Language)}
            className="text-muted underline-offset-2 hover:text-ink hover:underline"
          >
            {name}
          </button>
        ),
      )}
    </div>
  )
}

function Header() {
  const user = useLoaderData<typeof userLoader>()
  const { strings: t } = useLanguage()
  const navigate = useNavigate()
  const signOut = async () => {
    await api['sign-out'].$post()
    await navigate('/')
  }
  return (
    <header className="border-b border-rule bg-card">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
        <ProductName />
        <div className="flex items-center gap-6">
          <LanguageSelector />
          {user && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted">{user.name}</span>
              <button type="button" onClick={signOut} className="text-accent underline-offset-2 hover:underline">
                {t.signingIn.signOut}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export function Layout() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export function Failed() {
  const { strings: t } = useLanguage()
  return (
    <Page>
      <Card>
        <p className="text-sm text-warn">{t.failed}</p>
      </Card>
    </Page>
  )
}
