import { createRoute, Link, notFound } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { useLanguage } from '@/language';
import { blockers, sentence, type Story } from '@/prototype/project';
import { Card, Empty, External, Pill, Section } from '@/ui';
import { ProjectPage, projectRoute, useContents, useProjectParams } from './project';

/** Where a story is; once it has gone out, the version of the release that carried it. */
export function StatePill({ story }: { story: Story }) {
  const { strings: t } = useLanguage();
  if (story.release) return <Pill>{t.stories.released(story.release)}</Pill>;
  return <Pill tone={story.state === 'in progress' ? 'accent' : 'plain'}>{t.stories.states[story.state]}</Pill>;
}

export function StoryLink({ story, children }: { story: Story; children: ReactNode }) {
  const params = useProjectParams();
  return (
    <Link
      to="/projects/$owner/$repository/stories/$story"
      params={{ ...params, story: String(story.number) }}
      className="hover:text-accent"
    >
      {children}
    </Link>
  );
}

/** One story, with what a list of stories says of each. */
export function StoryLine({ story }: { story: Story }) {
  const { strings: t } = useLanguage();
  const project = useContents();
  const waitingFor = blockers(project, story);
  return (
    <div className="rounded-md border border-rule bg-card p-3">
      <p className="text-sm">
        <StoryLink story={story}>
          <span className="mr-1.5 text-xs text-muted">#{story.number}</span>
          <span className="font-medium">{story.title}</span>
        </StoryLink>
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted">
        <StatePill story={story} />
        {waitingFor.length > 0 && (
          <Pill tone="warn">{t.stories.blockedBy(waitingFor.map((other) => `#${other.number}`).join(', '))}</Pill>
        )}
        <span>{t.stories.sizes(story.value ?? '—', story.effort ?? '—')}</span>
        {story.mockUp && (
          <>
            <span>·</span>
            <External href={story.mockUp}>{t.stories.mockUp}</External>
          </>
        )}
      </div>
    </div>
  );
}

/** How many of a feature's stories the list of features shows. */
const firstFew = 3;

function Features() {
  const { strings: t } = useLanguage();
  const params = useProjectParams();
  const { features, stories } = useContents();
  return (
    <ProjectPage title={t.nav.features}>
      {features.length === 0 && <Empty>{t.features.none}</Empty>}
      {[...features]
        .sort((a, b) => a.number - b.number)
        .map((feature) => {
          const its = stories.filter((story) => story.feature === feature.number);
          return (
            <Card key={feature.number}>
              <h2 className="font-serif text-lg font-semibold">
                <Link
                  to="/projects/$owner/$repository/features/$feature"
                  params={{ ...params, feature: String(feature.number) }}
                  className="hover:text-accent"
                >
                  {feature.name}
                </Link>
              </h2>
              <p className="mt-1 font-serif text-muted">{feature.description}</p>
              {its.length === 0 ? (
                <div className="mt-3">
                  <Empty>{t.features.noStories}</Empty>
                </div>
              ) : (
                <ul className="mt-3 space-y-1 text-sm">
                  {its.slice(0, firstFew).map((story) => (
                    <li key={story.number} className="flex items-baseline gap-2">
                      <StoryLink story={story}>
                        <span className="mr-1.5 text-xs text-muted">#{story.number}</span>
                        {story.title}
                      </StoryLink>
                      <StatePill story={story} />
                    </li>
                  ))}
                  {its.length > firstFew && (
                    <li>
                      <Link
                        to="/projects/$owner/$repository/features/$feature"
                        params={{ ...params, feature: String(feature.number) }}
                        className="text-accent underline-offset-2 hover:underline"
                      >
                        {t.features.more(its.length - firstFew)}
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </Card>
          );
        })}
    </ProjectPage>
  );
}

export const featuresRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'features',
  component: Features,
});

function Feature() {
  const { strings: t } = useLanguage();
  const params = featureRoute.useParams();
  const { features, stories } = useContents();
  const feature = features.find((feature) => String(feature.number) === params.feature);
  if (!feature) throw notFound();
  const its = stories.filter((story) => story.feature === feature.number).sort((a, b) => a.number - b.number);
  return (
    <ProjectPage
      title={feature.name}
      back={
        <Link to="/projects/$owner/$repository/features" params={params} className="hover:text-ink">
          {t.nav.features}
        </Link>
      }
    >
      <p className="-mt-4 font-serif text-lg">{feature.description}</p>
      <Section title={t.features.stories(its.length)}>
        {its.length === 0 && <Empty>{t.features.noStories}</Empty>}
        {its.map((story) => (
          <StoryLine key={story.number} story={story} />
        ))}
      </Section>
    </ProjectPage>
  );
}

export const featureRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'features/$feature',
  component: Feature,
});

function Field({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold tracking-widest text-muted uppercase">{title}</dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}

function StoryPage() {
  const { strings: t } = useLanguage();
  const params = storyRoute.useParams();
  const project = useContents();
  const story = project.stories.find((story) => String(story.number) === params.story);
  if (!story) throw notFound();
  const feature = project.features.find((feature) => feature.number === story.feature);
  const milestone = project.milestones.find((milestone) => milestone.stories.includes(story.number));
  const release = project.releases.find((release) => release.version === story.release);
  const blockedBy = project.stories.filter((other) => story.blockedBy.includes(other.number));
  return (
    <ProjectPage
      title={story.title}
      back={
        feature && (
          <Link
            to="/projects/$owner/$repository/features/$feature"
            params={{ ...params, feature: String(feature.number) }}
            className="hover:text-ink"
          >
            {feature.name}
          </Link>
        )
      }
    >
      <div className="-mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted">#{story.number}</span>
        <StatePill story={story} />
      </div>
      <p className="font-serif text-xl">{sentence(story)}</p>

      <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        <Field title={t.stories.value}>{story.value ?? <Empty>{t.stories.unsized}</Empty>}</Field>
        <Field title={t.stories.effort}>{story.effort ?? <Empty>{t.stories.unsized}</Empty>}</Field>
        <Field title={t.stories.milestone}>{milestone?.name ?? <Empty>{t.stories.noMilestone}</Empty>}</Field>
        <Field title={t.stories.release}>
          {release ? t.stories.releasedOn(release.version, release.date) : <Empty>{t.stories.notReleased}</Empty>}
        </Field>
      </dl>

      <Section title={t.stories.blockedByTitle}>
        {blockedBy.length === 0 && <Empty>{t.stories.notBlocked}</Empty>}
        {blockedBy.map((other) => (
          <StoryLine key={other.number} story={other} />
        ))}
      </Section>

      <Section title={t.stories.mockUp}>
        {story.mockUp ? (
          <p className="text-sm">
            <External href={story.mockUp}>{story.mockUp}</External>
          </p>
        ) : (
          <Empty>{t.stories.noMockUp}</Empty>
        )}
      </Section>

      <Section title={t.stories.plan}>
        {story.plan ? <p className="font-serif">{story.plan}</p> : <Empty>{t.stories.noPlan}</Empty>}
      </Section>
    </ProjectPage>
  );
}

export const storyRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'stories/$story',
  component: StoryPage,
});
