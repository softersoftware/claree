import { createRoute, Link, Outlet, redirect, useLocation } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { api } from '@/api';
import { useLanguage } from '@/language';
import { rootRoute, signedIn } from '@/layout';
import { projectAt } from '@/prototype/project';
import { Card, External, Page, Section } from '@/ui';

export const useProject = () => projectRoute.useLoaderData();
export const useProjectParams = () => projectRoute.useParams();
/** What the project holds beyond its README. */
export const useContents = () => projectAt(useProject().address);

type ProjectPath =
  | '/projects/$owner/$repository'
  | '/projects/$owner/$repository/workshops'
  | '/projects/$owner/$repository/domains'
  | '/projects/$owner/$repository/prototypes'
  | '/projects/$owner/$repository/features'
  | '/projects/$owner/$repository/milestones'
  | '/projects/$owner/$repository/branding';

function NavLink({ to, children, exact = false }: { to: ProjectPath; children: ReactNode; exact?: boolean }) {
  const params = useProjectParams();
  const pathname = useLocation({ select: (location) => location.pathname });
  const path = to.replace('$owner', params.owner).replace('$repository', params.repository);
  const active = exact ? pathname === path : pathname === path || pathname.startsWith(`${path}/`);
  return (
    <Link
      to={to}
      params={params}
      aria-current={active ? 'page' : undefined}
      className={`block rounded-md px-2 py-1 text-sm whitespace-nowrap ${
        active ? 'bg-paper font-medium text-ink' : 'text-muted hover:text-ink'
      }`}
    >
      {children}
    </Link>
  );
}

function ProjectNav() {
  const { strings: t } = useLanguage();
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-rule px-4 py-2 md:block md:w-48 md:shrink-0 md:space-y-0.5 md:border-r md:border-b-0 md:py-10">
      <NavLink to="/projects/$owner/$repository" exact>
        {t.nav.overview}
      </NavLink>
      <NavLink to="/projects/$owner/$repository/workshops">{t.nav.workshops}</NavLink>
      <NavLink to="/projects/$owner/$repository/domains">{t.nav.domains}</NavLink>
      <NavLink to="/projects/$owner/$repository/prototypes">{t.nav.prototypes}</NavLink>
      <NavLink to="/projects/$owner/$repository/features">{t.nav.features}</NavLink>
      <NavLink to="/projects/$owner/$repository/milestones">{t.nav.milestones}</NavLink>
      <NavLink to="/projects/$owner/$repository/branding">{t.nav.branding}</NavLink>
    </nav>
  );
}

function ProjectLayout() {
  return (
    <div className="mx-auto max-w-5xl md:flex">
      <ProjectNav />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
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
  component: ProjectLayout,
});

/** A page of a project, under the project's name; `back` leads to the page it was opened from. */
export function ProjectPage({ title, back, children }: { title?: string; back?: ReactNode; children: ReactNode }) {
  const { name } = useProject();
  return (
    <Page
      title={title}
      back={
        <>
          <span className="font-medium text-ink">{name}</span>
          {back && <> · {back}</>}
        </>
      }
    >
      {children}
    </Page>
  );
}

function Overview() {
  const { strings: t } = useLanguage();
  const { name, scope, address, link } = useProject();
  return (
    <Page title={name}>
      {scope !== '' && (
        <Section title={t.overview.scope}>
          <p className="font-serif text-lg">{scope}</p>
        </Section>
      )}
      <Section title={t.overview.repository}>
        <Card>
          <p className="text-sm break-all">{link ? <External href={link}>{address}</External> : address}</p>
        </Card>
      </Section>
    </Page>
  );
}

export const overviewRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: '/',
  component: Overview,
});
