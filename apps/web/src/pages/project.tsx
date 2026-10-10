import { createRoute, Outlet, redirect } from '@tanstack/react-router';
import type { Role } from '@claree/domain';
import { rewriteScope } from '@/actions';
import { languageName } from '@/i18n';
import { rootRoute } from '@/layout';
import { useDictionaryIn } from '@/locale';
import { ProjectNav } from '@/nav';
import { open } from '@/projects';
import { Button, Card, Empty, Page, Pill, Section, Textarea } from '@/ui';

function ProjectLayout() {
  const { project, writable } = projectRoute.useLoaderData();
  const { locale, t } = useDictionaryIn(project.language);

  return (
    // What the platform says here may not be what it says elsewhere: inside a
    // project, it speaks that project's language until the person chooses.
    <div lang={locale} className="md:flex">
      <ProjectNav
        projectId={project.id}
        title={project.name}
        badge={writable ? undefined : <Pill>{t.overview.readingOnly}</Pill>}
        menu={t.nav.menu}
        closeMenu={t.nav.closeMenu}
        groups={[
          { items: [{ to: '/projects/$projectId', label: t.nav.overview, exact: true }] },
          {
            label: t.nav.business,
            items: [
              { to: '/projects/$projectId/business/workshops', label: t.nav.workshops },
              { to: '/projects/$projectId/business/domains', label: t.nav.domains },
            ],
          },
          {
            items: [
              { to: '/projects/$projectId/features', label: t.nav.features },
              { to: '/projects/$projectId/versions', label: t.nav.versions },
            ],
          },
        ]}
      />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'projects/$projectId',
  loader: ({ params }) => open(params.projectId),
  component: ProjectLayout,
});

function OverviewPage() {
  const { project, found, writable } = overviewRoute.useLoaderData();
  const { locale, t } = useDictionaryIn(project.language);

  // One person may hold both roles, and is named once.
  const people: { name: string; roles: Role[] }[] = [];
  for (const participant of project.participants) {
    const known = people.find((person) => person.name === participant.name);
    if (known) known.roles.push(participant.role);
    else people.push({ name: participant.name, roles: [participant.role] });
  }

  return (
    <Page>
      <Section title={t.scope.title}>
        <Card>
          {project.scope ? (
            <p className="whitespace-pre-line text-sm" lang={project.language}>
              {project.scope}
            </p>
          ) : (
            <Empty>{t.scope.noScope}</Empty>
          )}
          {writable && (
            <details className="mt-3 border-t border-rule pt-3">
              <summary className="cursor-pointer text-sm text-muted hover:text-ink">{t.scope.rewrite}</summary>
              <form action={rewriteScope} className="mt-2 flex flex-col gap-2">
                <input type="hidden" name="projectId" value={project.id} />
                <Textarea name="scope" placeholder={t.scope.placeholder} defaultValue={project.scope} />
                <div>
                  <Button quiet>{t.scope.rewrite}</Button>
                </div>
              </form>
            </details>
          )}
        </Card>
      </Section>

      <Section title={t.overview.whoTakesPart}>
        <Card>
          <ul className="space-y-1 text-sm">
            {people.map((person) => (
              <li key={person.name} className="flex items-center gap-2">
                <span lang={project.language}>{person.name}</span>
                {person.roles.map((role) => (
                  <Pill key={role}>{t.roles[role]}</Pill>
                ))}
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      <Section title={t.overview.address}>
        <Card>
          <a href={found.address} target="_blank" rel="noreferrer" className="block text-sm hover:text-accent">
            {found.address}
          </a>
          <p className="mt-1 text-sm text-muted">{found.isPublic ? t.publicProject : t.privateProject}</p>
          <p className="text-sm text-muted">{t.writtenIn(languageName(project.language, locale))}</p>
        </Card>
      </Section>
    </Page>
  );
}

export const overviewRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: '/',
  loader: ({ params }) => open(params.projectId),
  component: OverviewPage,
});

export const businessRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'business',
  beforeLoad: ({ params }) => {
    throw redirect({ to: '/projects/$projectId/business/workshops', params });
  },
});
