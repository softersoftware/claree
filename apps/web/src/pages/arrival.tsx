import { createRoute, Link } from '@tanstack/react-router';
import { type Account, type AvailableProject, mayOpen, projectsFor } from '@claree/domain';
import { arrive, openByAddress, removeProject } from '@/arrival-actions';
import { type Dictionary, languageName, type Locale } from '@/i18n';
import { rootRoute } from '@/layout';
import { useDictionary } from '@/locale';
import { productName } from '@/product';
import { arrivals, projectStore } from '@/projects';
import { Button, Card, Empty, Input, Page, Pill, Section } from '@/ui';

function ProjectRow({
  project,
  account,
  language,
  locale,
  t,
}: {
  project: AvailableProject;
  account?: Account;
  /** Known only once the project has been read. */
  language?: string;
  locale: Locale;
  t: Dictionary;
}) {
  const open = mayOpen(project, account);
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          {open ? (
            <Link
              to="/projects/$projectId"
              params={{ projectId: project.id }}
              className="text-sm font-medium hover:text-accent"
            >
              {project.name}
            </Link>
          ) : (
            <p className="text-sm font-medium text-muted">{project.name}</p>
          )}
          <p className="mt-1 text-sm text-muted">{project.isPublic ? t.publicProject : t.privateProject}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {language && <Pill>{t.writtenIn(languageName(language, locale))}</Pill>}
          <form action={removeProject}>
            <input type="hidden" name="projectId" value={project.id} />
            <button type="submit" className="text-sm text-muted hover:text-ink">
              {t.arrival.remove}
            </button>
          </form>
        </div>
      </div>
    </Card>
  );
}

/** The other way in: a project's address, which asks nothing of anyone. */
function OpenByAddress({ unknown, t }: { unknown?: string; t: Dictionary }) {
  return (
    <Section title={t.arrival.addProject}>
      <Card>
        <form action={openByAddress} className="flex flex-col gap-2 sm:flex-row">
          <Input
            name="address"
            placeholder="https://github.com/softersoftware/claree"
            label={t.arrival.projectAddress}
          />
          <Button quiet>{t.arrival.openIt}</Button>
        </form>
        {unknown && <p className="mt-2 text-sm text-warn">{t.arrival.unknown(unknown)}</p>}
      </Card>
    </Section>
  );
}

function ArrivalPage() {
  const { unknown } = arrivalRoute.useSearch();
  const { account, projects, languages } = arrivalRoute.useLoaderData();
  const { locale, t } = useDictionary();

  return (
    <Page title={account ? undefined : productName}>
      {!account && (
        <Card>
          <form action={arrive}>
            <Button>{t.arrival.signIn}</Button>
          </form>
        </Card>
      )}

      {(account || projects.length > 0) && (
        <Section title={t.arrival.yourProjects(projects.length)}>
          {projects.length === 0 && <Empty>{t.arrival.nothingAdded}</Empty>}
          {projects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              account={account}
              language={languages.get(project.id)}
              locale={locale}
              t={t}
            />
          ))}
        </Section>
      )}

      <OpenByAddress unknown={unknown} t={t} />
    </Page>
  );
}

export const arrivalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  /** `unknown`: an address someone typed, where no project was found. */
  validateSearch: (search: Record<string, unknown>): { unknown?: string } =>
    typeof search.unknown === 'string' ? { unknown: search.unknown } : {},
  loader: async () => {
    const account = await arrivals.whoIsHere();
    const added = await arrivals.addedProjects();
    const projects = projectsFor(await projectStore.available(account), added, account);
    const languages = new Map(
      await Promise.all(
        projects.map(async (project) => [project.id, (await projectStore.load(project.id))?.language] as const),
      ),
    );
    return { account, projects, languages };
  },
  component: ArrivalPage,
});
