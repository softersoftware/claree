import type { Metadata } from 'next'
import './globals.css'
import { currentLanguage, strings } from '@/language'
import { productName } from '@/product'
import { currentUser } from '@/session'
import { LanguageSelector } from './language-selector'
import { ProductName } from './product-name'

export async function generateMetadata(): Promise<Metadata> {
  return { title: productName, description: (await strings()).description }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [language, t, user] = await Promise.all([currentLanguage(), strings(), currentUser()])
  return (
    <html lang={language} className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <header className="border-b border-rule bg-card">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
            <ProductName />
            <div className="flex items-center gap-6">
              <LanguageSelector current={language} label={t.language} />
              {user && (
                <form action="/sign-out" method="post" className="flex items-center gap-3 text-sm">
                  <span className="text-muted">{user.name}</span>
                  <button type="submit" className="text-accent underline-offset-2 hover:underline">
                    {t.signingIn.signOut}
                  </button>
                </form>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
