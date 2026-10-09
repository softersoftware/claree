import { en as t } from '@/i18n/en'
import { currentUser } from '@/session'
import { ProductName } from './product-name'

export default async function ProjectsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await currentUser()
  return (
    <>
      <header className="border-b border-rule bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
          <ProductName />
          {user && (
            <form action="/sign-out" method="post" className="flex items-center gap-3 text-sm">
              <span className="text-muted">{user.name}</span>
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
