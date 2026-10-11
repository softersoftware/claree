import { createRoute, Link, redirect } from '@tanstack/react-router';
import { api } from '@/api';
import { useLanguage } from '@/language';
import { rootRoute, signedIn } from '@/layout';
import { productName } from '@/product';
import { projectParams } from '@/project-address';
import { Card, Page, Section } from '@/ui';

function Projects() {
  const { strings: t } = useLanguage();
  const projects = projectsRoute.useLoaderData();
  const { unopened } = projectsRoute.useSearch();
  const refused = unopened && <p className="text-sm text-warn">{t.projects.unopened(unopened)}</p>;

  if (projects.found === 'not installed')
    return (
      <Page title={t.projects.title}>
        {refused}
        <Card>
          <p className="text-sm">{t.projects.notInstalled(productName)}</p>
          {projects.installAt && (
            <p className="mt-3 text-sm">
              <a href={projects.installAt} className="text-accent underline-offset-2 hover:underline">
                {t.projects.install(productName)}
              </a>
            </p>
          )}
        </Card>
      </Page>
    );
  if (projects.found === 'none readable')
    return (
      <Page title={t.projects.title}>
        {refused}
        <Card>
          <p className="text-sm">{t.projects.noneReadable(productName)}</p>
        </Card>
      </Page>
    );

  return (
    <Page title={t.projects.title}>
      {refused}
      <Section title={t.projects.count(projects.projects.length)}>
        {projects.projects.map(({ address, name, scope }) => (
          <Link key={address} to="/projects/$owner/$repository" params={projectParams(address)} className="block">
            <Card>
              <p className="font-serif text-lg font-semibold">{name}</p>
              {scope !== '' && <p className="mt-1 font-serif text-muted">{scope}</p>}
            </Card>
          </Link>
        ))}
      </Section>
    </Page>
  );
}

export const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'projects',
  /** `unopened`: the project someone tried to open, and could not. */
  validateSearch: (search: Record<string, unknown>): { unopened?: string } =>
    typeof search.unopened === 'string' ? { unopened: search.unopened } : {},
  beforeLoad: signedIn,
  loader: async () => {
    const response = await api.projects.$get();
    if (!response.ok) throw redirect({ to: '/' });
    return response.json();
  },
  component: Projects,
});
