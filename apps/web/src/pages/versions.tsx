import { createRoute } from '@tanstack/react-router';
import { releasableStories } from '@claree/domain';
import { cutVersion } from '@/actions';
import { useDictionaryIn } from '@/locale';
import { open } from '@/projects';
import { StoryLink, StorySentence } from '@/story-line';
import { Button, Card, Empty, Input, Page, Section } from '@/ui';
import { projectRoute } from './project';

function VersionsPage() {
  const { project, writable } = versionsRoute.useLoaderData();
  const { t } = useDictionaryIn(project.language);
  const { stories, versions } = project;
  const releasable = releasableStories(stories, versions);
  const storyById = new Map(stories.map((story) => [story.id, story]));

  return (
    <Page title={t.versions.title}>
      <Section title={t.versions.readyToGoOut(releasable.length)}>
        {releasable.length === 0 && <Empty>{t.versions.noneReady}</Empty>}
        {releasable.map((story) => (
          <Card key={story.id}>
            <StoryLink projectId={project.id} story={story} className="text-sm hover:text-accent">
              <StorySentence story={story} language={project.language} reason={false} />
            </StoryLink>
          </Card>
        ))}
        {writable && releasable.length > 0 && (
          <Card>
            <form action={cutVersion} className="flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="projectId" value={project.id} />
              <Input name="name" placeholder={t.versions.versionName} />
              <Button>{t.versions.cut}</Button>
            </form>
          </Card>
        )}
      </Section>

      <Section title={t.versions.all}>
        {[...versions].reverse().map((version) => (
          <Card key={version.name}>
            <p className="text-sm font-medium">{version.name}</p>
            <ul className="mt-1 space-y-0.5 text-sm text-muted" lang={project.language}>
              {version.storyIds.map((id) => {
                const story = storyById.get(id);
                return (
                  <li key={id}>
                    {story ? (
                      <StoryLink projectId={project.id} story={story} className="hover:text-accent">
                        {story.intention}
                      </StoryLink>
                    ) : (
                      id
                    )}
                  </li>
                );
              })}
            </ul>
          </Card>
        ))}
      </Section>
    </Page>
  );
}

export const versionsRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'versions',
  loader: ({ params }) => open(params.projectId),
  component: VersionsPage,
});
