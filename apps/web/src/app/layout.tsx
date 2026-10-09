import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { en as t } from '@/i18n/en'
import { productName } from '@/product'
import { signedIn } from '@/session'

export const metadata: Metadata = { title: productName, description: t.description }

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const who = await signedIn()
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <header className="border-b border-rule bg-card">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
            <Link href="/" className="text-sm font-semibold tracking-tight">
              {productName}
            </Link>
            {who && (
              <form action="/sign-out" method="post" className="flex items-center gap-3 text-sm">
                <span className="text-muted">{who.participant.name}</span>
                <button type="submit" className="text-accent underline-offset-2 hover:underline">
                  {t.signingIn.signOut}
                </button>
              </form>
            )}
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
