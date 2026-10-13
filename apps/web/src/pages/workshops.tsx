import { createRoute } from '@tanstack/react-router';
import { useLanguage } from '@/language';
import { Card, Empty, External, Pill } from '@/ui';
import { ProjectPage, projectRoute, useContents } from './project';

function Workshops() {
  const { strings: t } = useLanguage();
  const { workshops } = useContents();
  const byDate = [...workshops].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <ProjectPage title={t.nav.workshops}>
      {workshops.length === 0 && <Empty>{t.workshops.none}</Empty>}
      {byDate.map((workshop) => (
        <Card key={workshop.date + workshop.title}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-serif text-lg font-semibold">{workshop.title}</h2>
            <span className="text-sm text-muted tabular-nums">{workshop.date}</span>
          </div>
          {workshop.documents.length === 0 ? (
            <div className="mt-2">
              <Empty>{t.workshops.noDocuments}</Empty>
            </div>
          ) : (
            <ul className="mt-3 space-y-1.5">
              {workshop.documents.map((document) => (
                <li key={document.link} className="flex items-baseline gap-2 text-sm">
                  <Pill tone={document.kind === 'sketch' ? 'accent' : 'plain'}>{t.workshops.kinds[document.kind]}</Pill>
                  <External href={document.link}>{document.title}</External>
                </li>
              ))}
            </ul>
          )}
        </Card>
      ))}
    </ProjectPage>
  );
}

export const workshopsRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'workshops',
  component: Workshops,
});
