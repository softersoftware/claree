import { Link, type LoaderFunctionArgs, redirect, useLoaderData } from 'react-router';
import { api } from '@/api';
import { useLanguage } from '@/language';
import { productName } from '@/product';
import { projectPage } from '@/project-address';
import { Card, Page, Section } from '@/ui';

export const projectsLoader = async ({ request }: LoaderFunctionArgs) => {
  const response = await api.projects.$get();
  if (!response.ok) return redirect('/');
  return { projects: await response.json(), unopened: new URL(request.url).searchParams.get('unopened') };
};

export function Projects() {
  const { strings: t } = useLanguage();
  const { projects, unopened } = useLoaderData<typeof projectsLoader>();
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
          <Link key={address} to={projectPage(address)} className="block">
            <Card>
              <p className="text-sm font-semibold">{name}</p>
              {scope !== '' && <p className="mt-1 text-sm text-muted">{scope}</p>}
            </Card>
          </Link>
        ))}
      </Section>
    </Page>
  );
}
