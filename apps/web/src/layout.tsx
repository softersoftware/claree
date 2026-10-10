import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { leave } from '@/arrival-actions';
import { dictionaryOf, locales } from '@/i18n';
import { useDictionary, useSpeaking } from '@/locale';
import { productName } from '@/product';
import { arrivals } from '@/projects';
import { Page } from '@/ui';

function Layout() {
  const account = rootRoute.useLoaderData();
  const { locale, t } = useDictionary();
  const { followsProject, choose, followProject } = useSpeaking();

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-rule bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
          <Link to="/" className="text-sm font-semibold tracking-tight">
            {productName}
          </Link>
          {account ? (
            <form action={leave} className="flex items-center gap-3">
              <span className="text-sm text-muted">{account.name}</span>
              <button type="submit" className="text-sm text-muted hover:text-ink">
                {t.header.leave}
              </button>
            </form>
          ) : (
            <span className="text-sm text-muted">{t.header.notSignedIn}</span>
          )}
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-rule px-6 py-4 text-xs text-muted">
        <div className="mx-auto flex max-w-3xl flex-col gap-2">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2">
              <span>{t.footer.language}</span>
              {locales.map((one) => (
                <button
                  key={one}
                  type="button"
                  onClick={() => choose(one)}
                  lang={one}
                  aria-pressed={one === locale}
                  className={one === locale ? 'font-medium text-ink' : 'hover:text-ink'}
                >
                  {dictionaryOf(one).languageName}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span>{t.footer.useProjectLanguage}</span>
              {[
                { follows: true, label: t.footer.yes },
                { follows: false, label: t.footer.no },
              ].map((one) => (
                <button
                  key={one.label}
                  type="button"
                  onClick={() => followProject(one.follows)}
                  aria-pressed={one.follows === followsProject}
                  className={one.follows === followsProject ? 'font-medium text-ink' : 'hover:text-ink'}
                >
                  {one.label}
                </button>
              ))}
            </div>
          </div>
          <span>{t.footer.note}</span>
        </div>
      </footer>
    </div>
  );
}

/** What a page that does not exist, or a project that cannot be opened, shows. */
function NotFound() {
  return (
    <Page>
      <p className="text-sm text-muted">404 — This page could not be found.</p>
    </Page>
  );
}

export const rootRoute = createRootRoute({
  loader: async () => (await arrivals.whoIsHere()) ?? null,
  component: Layout,
  notFoundComponent: NotFound,
});
