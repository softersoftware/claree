import { createRoute } from '@tanstack/react-router';
import { AgreeBy, isDomainExpert } from '@/agreement';
import { useLanguage } from '@/language';
import { inOrder, nextVersion, ratio, type Status, storiesOf, today, whyNotDeployable } from '@/sketch/business';
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

const columns: readonly Status[] = ['to do', 'in progress', 'done'];

function UnderWay() {
  const { strings: t } = useLanguage();
  const { business } = useBusiness();
  const next = nextVersion(business);
  return (
    <ProjectPage title={t.underway.title}>
      <Note>{t.underway.note}</Note>
      {!next ? (
        <Empty>{t.underway.none}</Empty>
      ) : (
        <>
          <p className="font-medium">{t.underway.of(next.name)}</p>
          <div className="grid gap-6 sm:grid-cols-3">
            {columns.map((status) => (
              <Section key={status} title={t.stories.statuses[status]}>
                {inOrder(business, storiesOf(business, next.name))
                  .filter((story) => story.status === status)
                  .map((story) => (
                    <div key={story.id} className="space-y-2">
                      <StoryLine story={story} />
                      <div className="flex flex-wrap gap-1.5 text-xs">
                        {status === 'to do' && (
                          <>
                            <Pill tone={story.mockUp ? 'plain' : 'warn'}>
                              {story.mockUp ? '✓' : '·'} {t.stories.mockUp}
                            </Pill>
                            <Pill tone={story.plan ? 'plain' : 'warn'}>
                              {story.plan ? '✓' : '·'} {t.stories.plan}
                            </Pill>
                          </>
                        )}
                      </div>
                      <Implementing story={story} />
                    </div>
                  ))}
              </Section>
            ))}
          </div>
        </>
      )}
    </ProjectPage>
  );
}

export const underWayRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'under-way',
  component: UnderWay,
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
