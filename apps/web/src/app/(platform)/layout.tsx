import { en as t } from '@/i18n/en'
import { signedIn } from '@/session'
import { ProductName } from './product-name'

/** The platform's own pages: its name, and who is signed in, above each of them. */
export default async function PlatformLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const who = await signedIn()
  return (
    <>
      <header className="border-b border-rule bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
          <ProductName />
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
    </>
  )
}
