import { createRoute } from '@tanstack/react-router';
import { useLanguage } from '@/language';
import { milestoneState, stateOf, states, totals } from '@/prototype/project';
import { Card, Empty, External, Section } from '@/ui';
import { StatePill, StoryLine } from './features';
import { ProjectPage, projectRoute, useContents } from './project';

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
        const state = milestoneState(its);
        const prototype = prototypes.find((prototype) => prototype.milestone === milestone.name);
        return (
          <Card key={milestone.name}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-serif text-xl font-semibold">{milestone.name}</h2>
              <StatePill state={state}>{t.milestones.states[state]}</StatePill>
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
              {states.map((group) => {
                const inGroup = its.filter((story) => stateOf(story) === group);
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
