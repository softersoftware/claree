import { createRoute } from '@tanstack/react-router';
import { useLanguage } from '@/language';
import { Card, Empty, External } from '@/ui';
import { ProjectPage, projectRoute, useContents } from './project';

function Prototypes() {
  const { strings: t } = useLanguage();
  const { prototypes } = useContents();
  return (
    <ProjectPage title={t.nav.prototypes}>
      {prototypes.length === 0 && <Empty>{t.prototypes.none}</Empty>}
      {prototypes.map((prototype) => (
        <Card key={prototype.milestone}>
          <h2 className="font-serif text-lg font-semibold">{prototype.milestone}</h2>
          <p className="mt-1 text-sm">
            <External href={prototype.link}>{t.prototypes.tryIt}</External>
          </p>
        </Card>
      ))}
    </ProjectPage>
  );
}

export const prototypesRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'prototypes',
  component: Prototypes,
});
