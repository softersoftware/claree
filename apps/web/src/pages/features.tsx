import { createRoute, Link, notFound } from '@tanstack/react-router';
import { countByState, nextStory, prototypesOf, sizes, stateOf, storiesOf, versionCarrying } from '@claree/domain';
import { addFeature, addPrototype, addStory, finishStory, startStory } from '@/actions';
import { useDictionaryIn } from '@/locale';
import { open } from '@/projects';
import { PrototypeCard } from '@/prototype-card';
import { StoryLine, StorySentence } from '@/story-line';
import { backLink, Button, Card, Empty, Input, Page, Pill, Section, Select } from '@/ui';
import { projectRoute } from './project';

function FeaturesPage() {
  const { project, writable } = featuresRoute.useLoaderData();
  const { t } = useDictionaryIn(project.language);
  const { features, stories } = project;

  return (
    <Page title={t.features.title}>
      <Section title={t.features.list(features.length)}>
        {features.map((feature) => {
          const own = storiesOf(feature, stories);
          const counts = countByState(own);
          const prototypes = prototypesOf(feature, project.prototypes);
          const validated = prototypes.filter((prototype) => prototype.state === 'validated');
          return (
            <Card key={feature.id}>
              <div className="flex items-start justify-between gap-3">
                <div lang={project.language}>
                  <Link
                    to="/projects/$projectId/features/$featureId"
                    params={{ projectId: project.id, featureId: feature.id }}
                    className="text-sm font-medium hover:text-accent"
                  >
                    {feature.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{feature.purpose}</p>
                </div>
                <Pill tone={stateOf(feature, stories) === 'done' ? 'accent' : 'plain'}>
                  {t.storyStates[stateOf(feature, stories)]}
                </Pill>
              </div>
              <p className="mt-2 text-sm text-muted">
                {own.length === 0
                  ? t.features.noStory
                  : t.features.storyCounts(own.length, counts.done, counts.in_progress, counts.to_do)}
              </p>
              {prototypes.length > 0 && (
                <p className="mt-1 text-sm text-muted">
                  {t.prototypes.counts(prototypes.length - validated.length, validated.length)}
                </p>
              )}
            </Card>
          );
        })}
        {writable && (
          <Card>
            <form action={addFeature} className="flex flex-col gap-2">
              <input type="hidden" name="projectId" value={project.id} />
              <Input name="name" placeholder={t.features.featureName} />
              <Input name="purpose" placeholder={t.features.featurePurpose} />
              <div>
                <Button quiet>{t.features.addFeature}</Button>
              </div>
            </form>
          </Card>
        )}
      </Section>
    </Page>
  );
}

export const featuresRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'features',
  loader: ({ params }) => open(params.projectId),
  component: FeaturesPage,
});

function FeaturePage() {
  const { project, writable, feature } = featureRoute.useLoaderData();
  const { t } = useDictionaryIn(project.language);
  const { stories } = project;

  const own = storiesOf(feature, stories);
  const prototypes = prototypesOf(feature, project.prototypes);
  const next = nextStory(stories);

  return (
    <Page
      title={feature.name}
      back={
        <Link className={backLink} to="/projects/$projectId/features" params={{ projectId: project.id }}>
          ← {t.features.title}
        </Link>
      }
    >
      <Section title={t.features.whatItIsFor}>
        <Card>
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm" lang={project.language}>
              {feature.purpose}
            </p>
            <Pill tone={stateOf(feature, stories) === 'done' ? 'accent' : 'plain'}>
              {t.storyStates[stateOf(feature, stories)]}
            </Pill>
          </div>
        </Card>
      </Section>

      <Section title={t.features.stories(own.length)}>
        <Card>
          {own.length === 0 ? (
            <Empty>{t.features.describesNothing}</Empty>
          ) : (
            <div className="space-y-3">
              {own.map((story) => (
                <StoryLine
                  key={story.id}
                  projectId={project.id}
                  language={project.language}
                  story={story}
                  next={story.id === next?.id}
                  writable={writable}
                  t={t}
                />
              ))}
            </div>
          )}
        </Card>
      </Section>

      {writable && (
        <Section title={t.features.addStory}>
          <Card>
            <form action={addStory} className="flex flex-col gap-2">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="featureId" value={feature.id} />
              <Input name="role" placeholder={t.features.role} />
              <Input name="intention" placeholder={t.features.intention} />
              <Input name="reason" placeholder={t.features.reason} />
              <div className="flex items-center gap-2">
                <Select
                  name="effort"
                  options={Object.fromEntries(sizes.map((size) => [size, t.story.effort(size)]))}
                  defaultValue="M"
                />
                <Select
                  name="value"
                  options={Object.fromEntries(sizes.map((size) => [size, t.story.value(size)]))}
                  defaultValue="M"
                />
                <Button quiet>{t.features.add}</Button>
              </div>
            </form>
          </Card>
        </Section>
      )}

      <Section title={t.prototypes.list(prototypes.length)}>
        {prototypes.length === 0 && <Empty>{t.prototypes.nothingToTry}</Empty>}
        {prototypes.map((prototype) => (
          <PrototypeCard
            key={prototype.id}
            prototype={prototype}
            projectId={project.id}
            language={project.language}
            writable={writable}
            t={t}
          />
        ))}
        {writable && (
          <Card>
            <form action={addPrototype} className="flex flex-col gap-2">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="featureId" value={feature.id} />
              <Input name="name" placeholder={t.prototypes.name} />
              <Input name="location" placeholder={t.prototypes.location} required={false} />
              <div>
                <Button quiet>{t.prototypes.add}</Button>
              </div>
            </form>
          </Card>
        )}
      </Section>
    </Page>
  );
}

export const featureRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'features/$featureId',
  loader: async ({ params }) => {
    const opened = await open(params.projectId);
    const feature = opened.project.features.find((one) => one.id === params.featureId);
    if (!feature) throw notFound();
    return { ...opened, feature };
  },
  component: FeaturePage,
});

function StoryPage() {
  const { project, writable, feature, story } = storyRoute.useLoaderData();
  const { t } = useDictionaryIn(project.language);
  const { stories, versions } = project;

  const next = nextStory(stories);
  const carried = versionCarrying(versions, story.id);

  return (
    <Page
      title={story.intention}
      back={
        <Link
          className={backLink}
          to="/projects/$projectId/features/$featureId"
          params={{ projectId: project.id, featureId: feature.id }}
        >
          ← {feature.name}
        </Link>
      }
    >
      <Section title={t.story.theStory}>
        <Card>
          <p className="text-sm">
            <StorySentence story={story} language={project.language} />
          </p>
          <dl className="mt-4 space-y-2 border-t border-rule pt-3 text-sm">
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-muted">{t.story.person}</dt>
              <dd lang={project.language}>{story.role}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-muted">{t.story.intention}</dt>
              <dd lang={project.language}>{story.intention}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-muted">{t.story.reason}</dt>
              <dd lang={project.language}>{story.reason}</dd>
            </div>
          </dl>
        </Card>
      </Section>

      <Section title={t.story.whereItStands}>
        <Card>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={story.state === 'done' ? 'plain' : 'warn'}>{t.storyStates[story.state]}</Pill>
            <Pill>{t.story.value(story.value)}</Pill>
            <Pill>{t.story.effort(story.effort)}</Pill>
            {story.id === next?.id && <Pill tone="accent">{t.story.next}</Pill>}
          </div>
          {writable && story.state !== 'done' && (
            <form action={story.state === 'to_do' ? startStory : finishStory} className="mt-3">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="id" value={story.id} />
              <Button>{story.state === 'to_do' ? t.story.startIt : t.story.itIsDone}</Button>
            </form>
          )}
        </Card>
      </Section>

      <Section title={t.versions.title}>
        <Card>
          {carried ? (
            <p className="text-sm">
              {t.story.carriedBy}{' '}
              <Link to="/projects/$projectId/versions" params={{ projectId: project.id }} className="hover:text-accent">
                {t.story.version(carried.name)}
              </Link>
            </p>
          ) : (
            <p className="text-sm italic text-muted">{t.story.noVersion}</p>
          )}
        </Card>
      </Section>
    </Page>
  );
}

export const storyRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'features/$featureId/stories/$storyId',
  loader: async ({ params }) => {
    const opened = await open(params.projectId);
    const story = opened.project.stories.find((one) => one.id === params.storyId);
    const feature = opened.project.features.find((one) => one.id === params.featureId);
    if (!story || !feature || story.featureId !== feature.id) throw notFound();
    return { ...opened, feature, story };
  },
  component: StoryPage,
});
