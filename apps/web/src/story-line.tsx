import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import type { Story } from '@claree/domain';
import { finishStory, startStory } from '@/actions';
import type { Dictionary } from '@/i18n';
import { storyWordsIn } from '@/i18n';
import { Button, Pill } from '@/ui';

/** Where a story is read. It hangs under the one feature it belongs to. */
export function StoryLink({
  projectId,
  story,
  className,
  children,
}: {
  projectId: string;
  story: Story;
  className: string;
  children: ReactNode;
}) {
  return (
    <Link
      to="/projects/$projectId/features/$featureId/stories/$storyId"
      params={{ projectId, featureId: story.featureId, storyId: story.id }}
      className={className}
    >
      {children}
    </Link>
  );
}

/** A story, told in the language of the project it belongs to — never translated. */
export function StorySentence({
  story,
  language,
  reason = true,
}: {
  story: Story;
  language: string;
  reason?: boolean;
}) {
  const words = storyWordsIn(language);
  return (
    <span lang={language}>
      {words.asA(story.role)}
      <strong>{story.role}</strong>, {words.iWant} {story.intention}
      {reason && `, ${words.soThat} ${story.reason}`}.
    </span>
  );
}

export function StoryLine({
  projectId,
  language,
  story,
  next = false,
  writable,
  t,
}: {
  projectId: string;
  language: string;
  story: Story;
  next?: boolean;
  writable: boolean;
  t: Dictionary;
}) {
  return (
    <div className="border-t border-rule pt-3 first:border-0 first:pt-0">
      <div className="flex items-start justify-between gap-3">
        <StoryLink projectId={projectId} story={story} className="text-sm hover:text-accent">
          <StorySentence story={story} language={language} />
        </StoryLink>
        <div className="flex shrink-0 gap-1">
          {next && <Pill tone="accent">{t.story.next}</Pill>}
          <Pill tone={story.state === 'done' ? 'plain' : 'warn'}>{t.storyStates[story.state]}</Pill>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Pill>{t.story.value(story.value)}</Pill>
        <Pill>{t.story.effort(story.effort)}</Pill>
        {writable && story.state !== 'done' && (
          <form action={story.state === 'to_do' ? startStory : finishStory}>
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="id" value={story.id} />
            <Button quiet>{story.state === 'to_do' ? t.story.startIt : t.story.itIsDone}</Button>
          </form>
        )}
      </div>
    </div>
  );
}
