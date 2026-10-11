import { createRoute, redirect, useRouter } from '@tanstack/react-router';
import { api } from '@/api';
import { useLanguage } from '@/language';
import { rootRoute } from '@/layout';
import { Logo } from '@/logo';
import { Button, Card, Page } from '@/ui';

function SignIn() {
  const { strings: t } = useLanguage();
  const failed = signInRoute.useSearch({ select: (search) => search['signed-in'] === 'no' });
  const callback = new URL(useRouter().history.createHref('/sign-in/callback'), window.location.href).href;
  const signIn = async () => {
    const response = await api['sign-in'].$post({ json: { callback } });
    if (response.ok) window.location.assign((await response.json()).address);
  };
  return (
    <Page>
      <div className="space-y-3 pt-6">
        <Logo large />
        <p className="font-serif text-xl text-muted">{t.description}</p>
      </div>
      <Card>
        <p className="text-sm">{t.signingIn.needed}</p>
        <div className="mt-4">
          <Button onClick={signIn}>{t.signingIn.signIn}</Button>
        </div>
        {failed && <p className="mt-2 text-sm text-warn">{t.signingIn.failed}</p>}
      </Card>
    </Page>
  );
}

export const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: (search: Record<string, unknown>): { 'signed-in'?: 'no' } =>
    search['signed-in'] === 'no' ? { 'signed-in': 'no' } : {},
  beforeLoad: ({ context }) => {
    if (context.user !== null) throw redirect({ to: '/projects' });
  },
  component: SignIn,
});

/** Where GitHub sends a person back: their answer is handed to the server, and the redirection clears it. */
export const callbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'sign-in/callback',
  beforeLoad: async ({ location }) => {
    // Read as GitHub sent it: the router's own search would turn a code made only of digits into a number.
    const query = Object.fromEntries(new URLSearchParams(location.searchStr));
    const response = await api['sign-in'].callback.$post({ json: query });
    throw response.ok ? redirect({ to: '/projects' }) : redirect({ to: '/', search: { 'signed-in': 'no' } });
  },
});
