import { createRoute, Link, Outlet, redirect, useLocation } from '@tanstack/react-router';
import { api } from '@/api';
import { useLanguage } from '@/language';
import { rootRoute, signedIn } from '@/layout';
import { currentStep, nextVersion, openQuestions, steps, type Participant, type Step } from '@/sketch/business';
import { BusinessProvider, useBusiness } from '@/sketch/store';
import { Button, Card, Empty, External, Page, Pill, Section } from '@/ui';

/** Where each step of the cycle is shown in a project. */
export const stepPages = {
  workshops: '/projects/$owner/$repository/workshops',
  domains: '/projects/$owner/$repository/domains',
  prototypes: '/projects/$owner/$repository/prototypes',
  'story mapping': '/projects/$owner/$repository/stories',
  'version planning': '/projects/$owner/$repository/versions',
  refinement: '/projects/$owner/$repository/refinement',
  implementation: '/projects/$owner/$repository/implementation',
  deployment: '/projects/$owner/$repository/deployment',
  feedback: '/projects/$owner/$repository/feedback',
} as const satisfies Record<Step, string>;

export const useProject = () => projectRoute.useLoaderData();
export const useProjectParams = () => projectRoute.useParams();

function NavLink({ to, children, exact = false }: { to: string; children: React.ReactNode; exact?: boolean }) {
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
  const { business } = useBusiness();
  const now = currentStep(business);
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-rule px-4 py-2 md:block md:w-56 md:shrink-0 md:space-y-4 md:border-r md:border-b-0 md:py-8">
      <NavLink to="/projects/$owner/$repository" exact>
        {t.nav.overview}
      </NavLink>
      <div className="md:space-y-0.5">
        <p className="hidden px-2 pb-1 text-xs font-semibold tracking-widest text-muted uppercase md:block">
          {t.nav.cycle}
        </p>
        <div className="flex gap-1 md:block md:space-y-0.5">
          {steps.map((step, index) => (
            <NavLink key={step} to={stepPages[step]}>
              <span className="inline-block w-5 text-xs tabular-nums">{index + 1}</span>
              {t.steps[step]}
              {step === now && <span className="ml-1 text-accent">•</span>}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="md:space-y-0.5">
        <p className="hidden px-2 pb-1 text-xs font-semibold tracking-widest text-muted uppercase md:block">
          {t.nav.outside}
        </p>
        <NavLink to="/projects/$owner/$repository/branding">{t.nav.branding}</NavLink>
      </div>
    </nav>
  );
}

function ProjectLayout() {
  const { address } = useProject();
  return (
    <BusinessProvider key={address} address={address}>
      <div className="mx-auto max-w-5xl md:flex">
        <ProjectNav />
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </BusinessProvider>
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

/** The project's name, and the language it is written in, at the top of each of its pages. */
export function ProjectPage({
  title,
  back,
  children,
}: {
  title: string;
  back?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { strings: t, language, choose } = useLanguage();
  const { name } = useProject();
  const { business } = useBusiness();
  const projectLanguage = t.languageNames[business.language];
  return (
    <Page
      title={title}
      back={
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span>
            {title !== name && <span className="font-medium text-ink">{name}</span>}
            {back && <> · {back}</>}
          </span>
          <span className="text-xs">
            {t.writtenIn(projectLanguage)}
            {business.language !== language && (
              <>
                {' · '}
                <button
                  type="button"
                  onClick={() => choose(business.language)}
                  className="text-accent underline-offset-2 hover:underline"
                >
                  {t.readIn(projectLanguage)}
                </button>
              </>
            )}
          </span>
        </div>
      }
    >
      {children}
    </Page>
  );
}

function ParticipantLine({ participant }: { participant: Participant }) {
  const { strings: t } = useLanguage();
  const roles = [
    ...participant.roles.map((role) => t.roles[role]),
    ...participant.crafts.map((craft) => t.crafts[craft]),
  ];
  return (
    <li className="flex flex-wrap items-baseline justify-between gap-x-4 py-2">
      <span>{participant.name}</span>
      <span className="text-sm text-muted">{roles.join(', ')}</span>
    </li>
  );
}

function Overview() {
  const { strings: t } = useLanguage();
  const { name, scope, address, link } = useProject();
  const params = useProjectParams();
  const { business, restart } = useBusiness();
  const now = currentStep(business);
  const next = nextVersion(business);
  const prototype = business.prototypes.find((prototype) => prototype.version === next?.name);
  const toConfirm = business.domains.flatMap((domain) => domain.rules).filter((rule) => !rule.agreement).length;
  const questions = openQuestions(business).length;
  const unsized = business.stories.filter((story) => !story.value || !story.effort).length;
  const waiting = [
    toConfirm > 0 && { text: t.overview.rulesToConfirm(toConfirm), to: stepPages.domains },
    questions > 0 && { text: t.overview.openQuestions(questions), to: stepPages.domains },
    prototype &&
      !prototype.validation && { text: t.overview.prototypeToTry(prototype.version), to: stepPages.prototypes },
    unsized > 0 && { text: t.overview.storiesToSize(unsized), to: stepPages['story mapping'] },
  ].filter((item) => item !== false && item !== undefined);

  return (
    <ProjectPage title={name}>
      <Section title={t.overview.scope}>
        {scope !== '' ? (
          <p className="font-serif text-lg" lang={business.language}>
            {scope}
          </p>
        ) : (
          <Empty>{t.overview.noScope}</Empty>
        )}
      </Section>

      <Section title={t.overview.cycle}>
        <ol className="grid grid-cols-1 gap-1 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step}>
              <Link
                to={stepPages[step]}
                params={params}
                className={`flex items-baseline gap-2 rounded-md border px-3 py-2 text-sm ${
                  step === now ? 'border-accent bg-card text-ink' : 'border-rule text-muted hover:text-ink'
                }`}
              >
                <span className="tabular-nums">{index + 1}</span>
                <span className="flex-1">{t.steps[step]}</span>
                {step === now && <Pill tone="accent">{t.overview.now}</Pill>}
              </Link>
            </li>
          ))}
        </ol>
      </Section>

      <Section title={t.overview.waiting}>
        {waiting.length === 0 ? (
          <Empty>{t.overview.nothingWaiting}</Empty>
        ) : (
          <ul className="space-y-1 text-sm">
            {waiting.map((item) => (
              <li key={item.text}>
                <Link to={item.to} params={params} className="text-accent underline-offset-2 hover:underline">
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={t.overview.participants}>
        {business.participants.length === 0 ? (
          <Empty>{t.overview.noParticipants}</Empty>
        ) : (
          <Card>
            <ul className="divide-y divide-rule">
              {business.participants.map((participant) => (
                <ParticipantLine key={participant.name} participant={participant} />
              ))}
            </ul>
          </Card>
        )}
      </Section>

      <Section title={t.overview.repository}>
        <Card>
          <p className="text-sm break-all">{link ? <External href={link}>{address}</External> : address}</p>
        </Card>
      </Section>

      <div className="border-t border-rule pt-6">
        <Button quiet onClick={restart}>
          {t.overview.restart}
        </Button>
      </div>
    </ProjectPage>
  );
}

export const overviewRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: '/',
  component: Overview,
});
