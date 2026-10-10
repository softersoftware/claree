import { createRoute, redirect } from '@tanstack/react-router';
import { api } from '@/api';
import { useLanguage } from '@/language';
import { rootRoute, signedIn } from '@/layout';
import { Card, Page, Section } from '@/ui';

function Project() {
  const { strings: t } = useLanguage();
  const { name, scope, address, link } = projectRoute.useLoaderData();
  return (
    <Page title={name}>
      {scope !== '' && (
        <Section title={t.overview.scope}>
          <p className="text-sm">{scope}</p>
        </Section>
      )}
      <Section title={t.overview.repository}>
        <Card>
          <p className="text-sm break-all">
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-2 hover:underline"
              >
                {address}
              </a>
            ) : (
              address
            )}
          </p>
        </Card>
      </Section>
    </Page>
  );
}

export const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'projects/$owner/$repository',
  beforeLoad: signedIn,
  loader: async ({ params: { owner, repository } }) => {
    const response = await api.projects[':owner'][':repository'].$get({ param: { owner, repository } });
    if (response.status === 401) throw redirect({ to: '/' });
    if (!response.ok) throw redirect({ to: '/projects', search: { unopened: `${owner}/${repository}` } });
    return response.json();
  },
  component: Project,
});
