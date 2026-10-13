import { createRoute } from '@tanstack/react-router';
import { AgreeBy, isDomainExpert } from '@/agreement';
import { useLanguage } from '@/language';
import { inOrder, nextVersion, ratio, type Story, storiesOf, today, whyNotDeployable } from '@/sketch/business';
import { useBusiness } from '@/sketch/store';
import { Adding, Button, Card, Empty, External, Form, Input, Note, Pill, Section, Select } from '@/ui';
import { ProjectPage, projectRoute } from './project';
import { Implementing, StoryLine } from './stories';

const shown = (value: number | undefined) => (value === undefined ? '—' : value.toFixed(2));

function Planning() {
  const { strings: t } = useLanguage();
  const { business, change } = useBusiness();
  const planned = business.versions.filter((version) => !version.deployed);
  const unplanned = business.stories.filter((story) => story.version === undefined);
  return (
    <ProjectPage title={t.steps['version planning']}>
      <Note>{t.planning.note}</Note>
      {planned.length === 0 && <Empty>{t.planning.none}</Empty>}
      {planned.map((version) => {
        const stories = storiesOf(business, version.name);
        const totals = ratio(stories);
        return (
          <Section
            key={version.name}
            title={t.prototypes.version(version.name)}
            aside={t.planning.totals(totals.value, totals.effort, shown(totals.ratio))}
          >
            {stories.length === 0 && <Empty>{t.planning.noStories}</Empty>}
            {stories.length > 0 && stories.length < 2 && <p className="text-xs text-warn">{t.planning.small}</p>}
            {inOrder(business, stories).map((story) => (
              <StoryLine key={story.id} story={story} />
            ))}
          </Section>
        );
      })}
      <Section title={t.planning.unplanned}>
        {unplanned.length === 0 && <Empty>{t.planning.allPlanned}</Empty>}
        {unplanned.map((story) => (
          <div key={story.id} className="space-y-1">
            <StoryLine story={story} />
            {planned.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted">
                {t.planning.planIn}
                <Select
                  label={t.planning.planIn}
                  value=""
                  options={[['', '—'] as const, ...planned.map((version) => [version.name, version.name] as const)]}
                  onChange={(name) =>
                    change((business) => {
                      const found = business.stories.find((other) => other.id === story.id);
                      if (found && name) found.version = name;
                    })
                  }
                />
              </div>
            )}
          </div>
        ))}
      </Section>
      <Adding label={t.planning.add}>
        <Form onSubmit={({ name = '' }) => change((business) => void business.versions.push({ name }))}>
          <div className="flex gap-2">
            <Input name="name" label={t.planning.name} />
            <Button submit>{t.add}</Button>
          </div>
        </Form>
      </Adding>
    </ProjectPage>
  );
}

export const planningRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'versions',
  component: Planning,
});

const refined = (story: Story) => story.mockUp !== undefined && story.plan !== undefined;

function Refinement() {
  const { strings: t } = useLanguage();
  const { business } = useBusiness();
  const next = nextVersion(business);
  const stories = next
    ? inOrder(business, storiesOf(business, next.name)).filter((story) => story.status === 'to do')
    : [];
  const groups = [
    { title: t.refinement.toRefine, stories: stories.filter((story) => !refined(story)) },
    { title: t.refinement.refined, stories: stories.filter(refined) },
  ];
  return (
    <ProjectPage title={t.steps.refinement}>
      <Note>{t.refinement.note}</Note>
      {!next ? (
        <Empty>{t.refinement.none}</Empty>
      ) : (
        <>
          <p className="font-medium">{t.refinement.of(next.name)}</p>
          {groups.map((group) => (
            <Section key={group.title} title={group.title}>
              {group.stories.length === 0 && <Empty>{t.refinement.nothing}</Empty>}
              {group.stories.map((story) => (
                <div key={story.id} className="space-y-2">
                  <StoryLine story={story} />
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    <Pill tone={story.mockUp ? 'plain' : 'warn'}>
                      {story.mockUp ? '✓' : '·'} {t.stories.mockUp}
                    </Pill>
                    <Pill tone={story.plan ? 'plain' : 'warn'}>
                      {story.plan ? '✓' : '·'} {t.stories.plan}
                    </Pill>
                  </div>
                </div>
              ))}
            </Section>
          ))}
        </>
      )}
    </ProjectPage>
  );
}

export const refinementRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'refinement',
  component: Refinement,
});

function Implementation() {
  const { strings: t } = useLanguage();
  const { business } = useBusiness();
  const next = nextVersion(business);
  const stories = next ? inOrder(business, storiesOf(business, next.name)) : [];
  const groups = [
    { title: t.implementation.ready, stories: stories.filter((story) => story.status === 'to do' && refined(story)) },
    {
      title: t.implementation.inProgress,
      stories: stories.filter((story) => story.status === 'in progress' && !story.demonstrated),
    },
    {
      title: t.implementation.toValidate,
      stories: stories.filter((story) => story.status === 'in progress' && story.demonstrated),
    },
    { title: t.implementation.done, stories: stories.filter((story) => story.status === 'done') },
  ];
  return (
    <ProjectPage title={t.steps.implementation}>
      <Note>{t.implementation.note}</Note>
      {!next ? (
        <Empty>{t.implementation.none}</Empty>
      ) : (
        <>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-medium">{t.implementation.of(next.name)}</p>
            <p className="text-sm">
              {business.demonstrationAt ? (
                <External href={business.demonstrationAt}>{t.implementation.environment}</External>
              ) : (
                <span className="text-muted">{t.stories.noEnvironment}</span>
              )}
            </p>
          </div>
          {groups.map((group) => (
            <Section key={group.title} title={group.title}>
              {group.stories.length === 0 && <Empty>{t.implementation.nothing}</Empty>}
              {group.stories.map((story) => (
                <div key={story.id} className="space-y-2">
                  <StoryLine story={story} />
                  <Implementing story={story} />
                </div>
              ))}
            </Section>
          ))}
        </>
      )}
    </ProjectPage>
  );
}

export const implementationRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'implementation',
  component: Implementation,
});

function Deployment() {
  const { strings: t } = useLanguage();
  const { business, change } = useBusiness();
  const next = nextVersion(business);
  const deployed = business.versions.filter((version) => version.deployed).reverse();
  const why = next && whyNotDeployable(business, next);
  const stories = next ? storiesOf(business, next.name) : [];
  const editNext = (apply: (version: NonNullable<typeof next>) => void) =>
    change((business) => {
      const found = business.versions.find((version) => version.name === next?.name);
      if (found) apply(found);
    });
  return (
    <ProjectPage title={t.steps.deployment}>
      <Note>{t.deployment.note}</Note>
      {!next ? (
        <Empty>{t.deployment.none}</Empty>
      ) : (
        <Section title={t.deployment.next(next.name)}>
          <Card tone="accent">
            <p className="text-sm">
              {t.deployment.storiesDone(stories.filter((story) => story.status === 'done').length, stories.length)}
            </p>
            <p className="mt-4 text-xs font-semibold text-muted">{t.deployment.demonstration}</p>
            {next.demonstration ? (
              <div className="mt-1 space-y-2 text-sm">
                <External href={next.demonstration.where}>{next.demonstration.where}</External>
                {next.demonstration.validation ? (
                  <p className="text-muted">
                    {t.prototypes.validatedBy(next.demonstration.validation.by, next.demonstration.validation.on)}
                  </p>
                ) : (
                  <AgreeBy
                    label={t.prototypes.validate}
                    among={isDomainExpert}
                    onAgree={(agreement) =>
                      editNext((version) => {
                        if (version.demonstration) version.demonstration.validation = agreement;
                      })
                    }
                  />
                )}
              </div>
            ) : (
              <div className="mt-1 space-y-2">
                <Empty>{t.deployment.noDemonstration}</Empty>
                <Form onSubmit={({ where = '' }) => editNext((version) => void (version.demonstration = { where }))}>
                  <div className="flex gap-2">
                    <Input name="where" label={t.deployment.where} />
                    <Button submit quiet>
                      {t.save}
                    </Button>
                  </div>
                </Form>
              </div>
            )}
            <div className="mt-4 space-y-1 border-t border-rule pt-4">
              <Button
                disabled={why !== undefined}
                onClick={() => editNext((version) => void (version.deployed = today()))}
              >
                {t.deployment.deploy}
              </Button>
              {why && <p className="text-xs text-muted">{t.deployment.notYet[why]}</p>}
            </div>
          </Card>
        </Section>
      )}

      <Section title={t.deployment.deployed}>
        {deployed.length === 0 && <Empty>{t.deployment.noneDeployed}</Empty>}
        {deployed.map((version) => (
          <Card key={version.name}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-medium">{t.prototypes.version(version.name)}</p>
              <span className="text-sm text-muted">{t.deployment.on(version.deployed ?? '')}</span>
            </div>
            <ul className="mt-3 space-y-2">
              {storiesOf(business, version.name).map((story) => (
                <li key={story.id}>
                  <StoryLine story={story} />
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </Section>
    </ProjectPage>
  );
}

export const deploymentRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'deployment',
  component: Deployment,
});
