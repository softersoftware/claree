import { createRoute, Link, notFound } from '@tanstack/react-router';
import { useLanguage } from '@/language';
import { byDate, type DocumentKind, today } from '@/sketch/business';
import { newId, useBusiness } from '@/sketch/store';
import { Adding, Button, Card, Empty, External, Form, Input, Note, Pill, Section, Select } from '@/ui';
import { ProjectPage, projectRoute, useProjectParams } from './project';

const kinds: readonly DocumentKind[] = ['notes', 'report', 'transcript', 'slides', 'recording', 'video', 'sketch'];

function Workshops() {
  const { strings: t } = useLanguage();
  const params = useProjectParams();
  const { business, change } = useBusiness();
  return (
    <ProjectPage title={t.steps.workshops}>
      <Note>{t.workshops.note}</Note>
      <Section title={t.steps.workshops}>
        {business.workshops.length === 0 && <Empty>{t.workshops.none}</Empty>}
        {byDate(business.workshops).map((workshop) => (
          <Link
            key={workshop.id}
            to="/projects/$owner/$repository/workshops/$workshop"
            params={{ ...params, workshop: workshop.id }}
            className="block"
          >
            <Card>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-serif text-lg font-semibold" lang={business.language}>
                  {workshop.title}
                </p>
                <span className="text-sm text-muted tabular-nums">{workshop.date}</span>
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                {t.workshops.documents(workshop.documents.length)}
                {workshop.documents.some((document) => document.kind === 'sketch') && (
                  <Pill>{t.workshops.kinds.sketch}</Pill>
                )}
              </p>
            </Card>
          </Link>
        ))}
        <Adding label={t.workshops.add}>
          <Form
            onSubmit={({ date = today(), title = '' }) =>
              change((business) => void business.workshops.push({ id: newId(), date, title, documents: [] }))
            }
          >
            <div className="flex gap-2">
              <Input name="date" type="date" label={t.workshops.date} defaultValue={today()} />
              <Input name="title" label={t.workshops.title} />
            </div>
            <Button submit>{t.add}</Button>
          </Form>
        </Adding>
      </Section>
    </ProjectPage>
  );
}

export const workshopsRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'workshops',
  component: Workshops,
});

function WorkshopPage() {
  const { strings: t } = useLanguage();
  const params = workshopRoute.useParams();
  const { business, change } = useBusiness();
  const workshop = business.workshops.find((workshop) => workshop.id === params.workshop);
  if (!workshop) throw notFound();
  return (
    <ProjectPage
      title={workshop.title}
      back={
        <Link to="/projects/$owner/$repository/workshops" params={params} className="hover:text-ink">
          {t.workshops.back}
        </Link>
      }
    >
      <p className="-mt-6 text-muted tabular-nums">{workshop.date}</p>
      <Section title={t.workshops.documents(workshop.documents.length)}>
        {workshop.documents.length === 0 && <Empty>{t.workshops.noDocuments}</Empty>}
        {workshop.documents.map((document) => (
          <Card key={document.id}>
            <div className="flex flex-wrap items-baseline gap-2">
              <Pill tone={document.kind === 'sketch' ? 'accent' : 'plain'}>{t.workshops.kinds[document.kind]}</Pill>
              <p className="font-medium" lang={business.language}>
                {document.title}
              </p>
            </div>
            {document.where && (
              <p className="mt-2 text-sm">
                {document.where.startsWith('http') ? (
                  <External href={document.where}>{document.where}</External>
                ) : (
                  <span className="font-mono text-xs break-all">{document.where}</span>
                )}
              </p>
            )}
            {document.text && (
              <p className="mt-2 font-serif whitespace-pre-line" lang={business.language}>
                {document.text}
              </p>
            )}
            {document.kind === 'sketch' && <p className="mt-2 text-xs text-muted">{t.workshops.sketchNote}</p>}
          </Card>
        ))}
        <Adding label={t.workshops.addDocument}>
          <Note>{t.workshops.addedLater}</Note>
          <div className="mt-3">
            <Form
              onSubmit={({ kind = 'notes', title = '', where = '', text = '' }) =>
                change((business) =>
                  business.workshops
                    .find((other) => other.id === workshop.id)
                    ?.documents.push({
                      id: newId(),
                      kind: kind as DocumentKind,
                      title,
                      ...(where && { where }),
                      ...(text && { text }),
                    }),
                )
              }
            >
              <div className="flex gap-2">
                <Select
                  name="kind"
                  label={t.workshops.kind}
                  options={kinds.map((kind) => [kind, t.workshops.kinds[kind]] as const)}
                />
                <Input name="title" label={t.workshops.documentTitle} />
              </div>
              <Input name="where" label={t.workshops.where} required={false} />
              <textarea
                name="text"
                aria-label={t.workshops.text}
                placeholder={t.workshops.text}
                rows={3}
                className="w-full rounded-md border border-rule bg-card px-3 py-1.5 text-sm outline-none focus:border-accent"
              />
              <Button submit>{t.add}</Button>
            </Form>
          </div>
        </Adding>
      </Section>
    </ProjectPage>
  );
}

export const workshopRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'workshops/$workshop',
  component: WorkshopPage,
});
