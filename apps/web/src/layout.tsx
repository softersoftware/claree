import { createRootRoute, Link, Outlet, redirect, useLocation, useRouter } from '@tanstack/react-router';
import { api } from '@/api';
import { languages, type Language, useLanguage } from '@/language';
import { Logo } from '@/logo';
import { Card, Page } from '@/ui';

/** The person signed in, or nobody: asked again on every navigation, since signing in or out changes it. */
const currentUser = async () => {
  const response = await api.user.$get();
  return response.ok ? response.json() : null;
};

/** For the pages that need someone signed in: everyone else is sent to sign in. */
export const signedIn = ({ context }: { context: { user: { name: string } | null } }) => {
  if (context.user === null) throw redirect({ to: '/' });
};

/** A link to the Projects page, except where it would lead nowhere new; the sign-in page shows the logo itself. */
function ProductName() {
  const pathname = useLocation({ select: (location) => location.pathname });
  if (pathname === '/') return <span />;
  return pathname === '/projects' ? (
    <Logo />
  ) : (
    <Link to="/projects">
      <Logo />
    </Link>
  );
}

function LanguageSelector() {
  const { language: current, strings: t, choose } = useLanguage();
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
  );
}

function Header() {
  const { user } = rootRoute.useRouteContext();
  const { strings: t } = useLanguage();
  const router = useRouter();
  const signOut = async () => {
    await api['sign-out'].$post();
    await router.navigate({ to: '/' });
  };
  return (
    <header className="border-t-4 border-b border-t-accent border-b-rule bg-card">
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
  );
}

function Layout() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

function Failed() {
  const { strings: t } = useLanguage();
  return (
    <Page>
      <Card>
        <p className="text-sm text-warn">{t.failed}</p>
      </Card>
    </Page>
  );
}

export const rootRoute = createRootRoute({
  beforeLoad: async () => ({ user: await currentUser() }),
  component: Layout,
  errorComponent: Failed,
  notFoundComponent: Failed,
});
