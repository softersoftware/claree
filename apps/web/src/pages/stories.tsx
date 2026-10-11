import { createRoute, Link, notFound } from '@tanstack/react-router';
import { useLanguage, stringsIn } from '@/language';
import { blockers, type Business, featureStatus, sizes, type Size, type Status, type Story } from '@/sketch/business';
import { newId, useBusiness } from '@/sketch/store';
import { Adding, Button, Card, Empty, External, Form, Input, Note, Pill, Section, Select, Textarea } from '@/ui';
import { ProjectPage, projectRoute, useProjectParams } from './project';

const statusTone = { 'to do': 'plain', 'in progress': 'accent', done: 'plain' } as const;

export function StatusPill({ status }: { status: Status }) {
  const { strings: t } = useLanguage();
  return <Pill tone={statusTone[status]}>{t.stories.statuses[status]}</Pill>;
}

/** A story as a person would say it, in the project's own language. */
export function StorySentence({ story }: { story: Story }) {
  const { business } = useBusiness();
  return (
    <span lang={business.language}>
      {stringsIn(business.language).stories.sentence(story.person, story.intention, story.reason)}
    </span>
  );
}

/** One story, as a line that leads to it. */
export function StoryLine({ story }: { story: Story }) {
  const { strings: t } = useLanguage();
  const params = useProjectParams();
  const { business } = useBusiness();
  const blocked = story.status === 'to do' && blockers(business, story).length > 0;
  return (
    <Link
      to="/projects/$owner/$repository/stories/$story"
      params={{ ...params, story: story.id }}
      className="block rounded-md border border-rule bg-card p-3 hover:border-accent"
    >
      <p className="font-serif text-sm">
        <span className="mr-1 font-sans text-xs text-muted">{t.stories.number(story.number)}</span>
        <StorySentence story={story} />
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted">
        <StatusPill status={story.status} />
        {blocked && <Pill tone="warn">{t.stories.blocked}</Pill>}
        <span>{t.stories.sizes(story.value ?? t.stories.unsized, story.effort ?? t.stories.unsized)}</span>
      </div>
    </Link>
  );
}

function StoryMap() {
  const { strings: t } = useLanguage();
  const { business, change } = useBusiness();
  return (
    <ProjectPage title={t.steps['story mapping']}>
      <Note>{t.stories.note}</Note>
      {business.features.length === 0 && <Empty>{t.stories.none}</Empty>}
      <div className="grid gap-6 sm:grid-cols-2">
        {business.features.map((feature) => (
          <Section
            key={feature.id}
            title={feature.name}
            aside={<StatusPill status={featureStatus(business, feature.id)} />}
          >
            {business.stories
              .filter((story) => story.feature === feature.id)
              .map((story) => (
                <StoryLine key={story.id} story={story} />
              ))}
          </Section>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {business.features.length > 0 && (
          <Adding label={t.stories.addStory}>
            <Form
              onSubmit={({ feature = '', person = '', intention = '', reason = '' }) =>
                change((business) => {
                  const number = Math.max(0, ...business.stories.map((story) => story.number)) + 1;
                  business.stories.push({
                    id: newId(),
                    number,
                    feature,
                    person,
                    intention,
                    reason,
                    status: 'to do',
                    blockedBy: [],
                  });
                })
              }
            >
              <Select
                name="feature"
                label={t.stories.feature}
                options={business.features.map((feature) => [feature.id, feature.name] as const)}
              />
              <Input name="person" label={t.stories.person} />
              <Input name="intention" label={t.stories.intention} />
              <Input name="reason" label={t.stories.reason} />
              <Button submit>{t.add}</Button>
            </Form>
          </Adding>
        )}
        <Adding label={t.stories.addFeature}>
          <Form onSubmit={({ name = '' }) => change((business) => void business.features.push({ id: newId(), name }))}>
            <Input name="name" label={t.stories.feature} />
            <Button submit>{t.add}</Button>
          </Form>
        </Adding>
      </div>
    </ProjectPage>
  );
}

export const storyMapRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'stories',
  component: StoryMap,
});

/** Why a story cannot start yet, if it cannot. */
export const whyNotStarting = (business: Business, story: Story) => {
  if (blockers(business, story).length > 0) return 'blocked';
  if (!story.mockUp || !story.plan) return 'not refined';
  return undefined;
};

/** Start or finish a story, as implementing it goes. */
export function Implementing({ story }: { story: Story }) {
  const { strings: t } = useLanguage();
  const { business, change } = useBusiness();
  const move = (status: Status) =>
    change((business) => {
      const found = business.stories.find((other) => other.id === story.id);
      if (found) found.status = status;
    });
  if (story.status === 'done') return null;
  if (story.status === 'in progress') return <Button onClick={() => move('done')}>{t.stories.finish}</Button>;
  const why = whyNotStarting(business, story);
  return (
    <div className="space-y-1">
      <Button onClick={() => move('in progress')} disabled={why !== undefined}>
        {t.stories.start}
      </Button>
      {why === 'blocked' && <p className="text-xs text-muted">{t.stories.blockedFirst}</p>}
      {why === 'not refined' && <p className="text-xs text-muted">{t.stories.notReady}</p>}
    </div>
  );
}

function StoryPage() {
  const { strings: t } = useLanguage();
  const params = storyRoute.useParams();
  const { business, change } = useBusiness();
  const story = business.stories.find((story) => story.id === params.story);
  if (!story) throw notFound();
  const edit = (apply: (story: Story) => void) =>
    change((business) => {
      const found = business.stories.find((other) => other.id === story.id);
      if (found) apply(found);
    });
  const feature = business.features.find((feature) => feature.id === story.feature);
  const version = business.versions.find((version) => version.name === story.version);
  const sizeOptions = [['', t.stories.unsized] as const, ...sizes.map((size) => [size, size] as const)];
  const others = business.stories.filter((other) => other.id !== story.id);

  return (
    <ProjectPage
      title={`${t.stories.number(story.number)} — ${feature?.name ?? ''}`}
      back={
        <Link to="/projects/$owner/$repository/stories" params={params} className="hover:text-ink">
          {t.stories.back}
        </Link>
      }
    >
      <p className="-mt-4 font-serif text-xl">
        <StorySentence story={story} />
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill status={story.status} />
        {version?.deployed && (
          <span className="text-sm text-muted">{t.stories.carriedBy(version.name, version.deployed)}</span>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Section title={t.stories.value}>
          <Select
            label={t.stories.value}
            value={story.value ?? ''}
            options={sizeOptions}
            onChange={(value) =>
              edit((story) => {
                if (value) story.value = value as Size;
                else delete story.value;
              })
            }
          />
          <p className="text-xs text-muted">{t.stories.valueBy}</p>
        </Section>
        <Section title={t.stories.effort}>
          <Select
            label={t.stories.effort}
            value={story.effort ?? ''}
            options={sizeOptions}
            onChange={(value) =>
              edit((story) => {
                if (value) story.effort = value as Size;
                else delete story.effort;
              })
            }
          />
          <p className="text-xs text-muted">{t.stories.effortBy}</p>
        </Section>
        <Section title={t.stories.version}>
          {version?.deployed ? (
            <p className="text-sm">{version.name}</p>
          ) : (
            <Select
              label={t.stories.version}
              value={story.version ?? ''}
              options={[
                ['', t.stories.noVersion] as const,
                ...business.versions
                  .filter((version) => !version.deployed)
                  .map((version) => [version.name, version.name] as const),
              ]}
              onChange={(value) =>
                edit((story) => {
                  if (value) story.version = value;
                  else delete story.version;
                })
              }
            />
          )}
        </Section>
      </div>

      <Section title={t.stories.blockedBy}>
        {others.length === 0 ? (
          <Empty>{t.stories.notBlocked}</Empty>
        ) : (
          <Card>
            <ul className="space-y-1">
              {others.map((other) => (
                <li key={other.id}>
                  <label className="flex items-baseline gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={story.blockedBy.includes(other.id)}
                      onChange={(event) =>
                        edit((story) => {
                          story.blockedBy = event.target.checked
                            ? [...story.blockedBy, other.id]
                            : story.blockedBy.filter((id) => id !== other.id);
                        })
                      }
                    />
                    <span className="text-xs text-muted">{t.stories.number(other.number)}</span>
                    <span className="flex-1 font-serif">
                      <StorySentence story={other} />
                    </span>
                    <StatusPill status={other.status} />
                  </label>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </Section>

      <Section title={t.stories.refinement}>
        <Card>
          <p className="text-xs font-semibold text-muted">{t.stories.mockUp}</p>
          {story.mockUp ? (
            <p className="mt-1 text-sm">
              <External href={story.mockUp}>{story.mockUp}</External>
            </p>
          ) : (
            <div className="mt-1 space-y-2">
              <Empty>{t.stories.noMockUp}</Empty>
              <Form onSubmit={({ mockUp = '' }) => edit((story) => void (story.mockUp = mockUp))}>
                <div className="flex gap-2">
                  <Input name="mockUp" label={t.workshops.where} />
                  <Button submit quiet>
                    {t.save}
                  </Button>
                </div>
              </Form>
            </div>
          )}
          <p className="mt-4 text-xs font-semibold text-muted">{t.stories.plan}</p>
          {story.plan ? (
            <p className="mt-1 text-sm whitespace-pre-line" lang={business.language}>
              {story.plan}
            </p>
          ) : (
            <div className="mt-1 space-y-2">
              <Empty>{t.stories.noPlan}</Empty>
              <Form onSubmit={({ plan = '' }) => edit((story) => void (story.plan = plan))}>
                <Textarea name="plan" label={t.stories.plan} />
                <Button submit quiet>
                  {t.save}
                </Button>
              </Form>
            </div>
          )}
        </Card>
      </Section>

      {story.status !== 'done' && (
        <Section title={t.stories.implementation}>
          <Implementing story={story} />
        </Section>
      )}
    </ProjectPage>
  );
}

export const storyRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'stories/$story',
  component: StoryPage,
});
