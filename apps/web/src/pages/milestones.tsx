import { createRoute } from '@tanstack/react-router';
import { useLanguage } from '@/language';
import { reached, type Story, totals } from '@/prototype/project';
import { Card, Empty, External, Pill, Section } from '@/ui';
import { StoryLine } from './features';
import { ProjectPage, projectRoute, useContents } from './project';

const groups = ['to do', 'in progress', 'done', 'released'] as const;

const groupOf = (story: Story): (typeof groups)[number] => (story.release ? 'released' : story.state);

function Milestones() {
  const { strings: t } = useLanguage();
  const { milestones, prototypes, stories } = useContents();
  return (
    <ProjectPage title={t.nav.milestones}>
      {milestones.length === 0 && <Empty>{t.milestones.none}</Empty>}
      {milestones.map((milestone) => {
        const its = milestone.stories
          .map((number) => stories.find((story) => story.number === number))
          .filter((story) => story !== undefined);
        const { value, effort } = totals(its);
        const prototype = prototypes.find((prototype) => prototype.milestone === milestone.name);
        return (
          <Card key={milestone.name}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-serif text-xl font-semibold">{milestone.name}</h2>
              {reached(its) && <Pill>{t.milestones.reached}</Pill>}
            </div>
            <p className="mt-1 font-serif text-muted">{milestone.description}</p>
            <p className="mt-2 text-xs text-muted">{t.milestones.totals(value, effort)}</p>
            <p className="mt-2 text-sm">
              {prototype ? (
                <External href={prototype.link}>{t.milestones.prototype}</External>
              ) : (
                <span className="text-muted">{t.milestones.noPrototype}</span>
              )}
            </p>
            <div className="mt-5 space-y-6">
              {its.length === 0 && <Empty>{t.milestones.noStories}</Empty>}
              {groups.map((group) => {
                const inGroup = its.filter((story) => groupOf(story) === group);
                return (
                  inGroup.length > 0 && (
                    <Section key={group} title={`${t.milestones.groups[group]} — ${inGroup.length}`}>
                      {inGroup.map((story) => (
                        <StoryLine key={story.number} story={story} />
                      ))}
                    </Section>
                  )
                );
              })}
            </div>
          </Card>
        );
      })}
    </ProjectPage>
  );
}

export const milestonesRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'milestones',
  component: Milestones,
});
