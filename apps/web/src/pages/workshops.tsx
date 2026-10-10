import { createRoute, Link, notFound } from '@tanstack/react-router';
import { type WorkshopDocument, workshopsByDate } from '@claree/domain';
import { addWorkshop, addWorkshopDocument, writeDocument } from '@/actions';
import { useDictionaryIn } from '@/locale';
import { MarkdownEditor } from '@/markdown-editor';
import { open, served } from '@/projects';
import { isMarkdown, isReadable, readStored, StoredDocument } from '@/stored-document';
import { backLink, Button, Card, Empty, Input, Page, Pill, Section, Select } from '@/ui';
import { projectRoute } from './project';

function WorkshopsPage() {
  const { project, writable } = workshopsRoute.useLoaderData();
  const { t } = useDictionaryIn(project.language);
  const held = workshopsByDate(project.business.workshops);

  return (
    <Page title={t.informal.title}>
      <Section title={t.informal.workshops(held.length)}>
        {held.length === 0 && <Empty>{t.informal.noWorkshop}</Empty>}
        {held.map((workshop) => (
          <Card key={workshop.id}>
            <p className="text-sm text-muted">{t.informal.heldOn(workshop.date)}</p>
            <Link
              to="/projects/$projectId/business/workshops/$workshopId"
              params={{ projectId: project.id, workshopId: workshop.id }}
              className="mt-1 block text-sm font-medium hover:text-accent"
              lang={project.language}
            >
              {workshop.title}
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted">{t.informal.documentCount(workshop.documents.length)}</span>
              {[...new Set(workshop.documents.map((document) => document.kind))].map((kind) => (
                <Pill key={kind}>{t.documentKinds[kind]}</Pill>
              ))}
            </div>
          </Card>
        ))}
        {writable && (
          <Card>
            <form action={addWorkshop} className="flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="projectId" value={project.id} />
              <Input type="date" name="date" placeholder={t.informal.whenHeld} />
              <Input name="title" placeholder={t.informal.workshopName} />
              <Button quiet>{t.informal.addWorkshop}</Button>
            </form>
          </Card>
        )}
      </Section>
    </Page>
  );
}

export const workshopsRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'business/workshops',
  loader: ({ params }) => open(params.projectId),
  component: WorkshopsPage,
});

/** What can be written in the project, when it is stored nowhere yet. */
const written: readonly WorkshopDocument['kind'][] = ['notes', 'report', 'transcript'];

/** A document whose text can be written or corrected here. */
const canWrite = (document: WorkshopDocument): boolean =>
  document.text !== undefined || (document.location ? isMarkdown(document.location) : written.includes(document.kind));

/**
 * A recording is played where it is read, and a written document is shown
 * there when it can be; anything else is opened where it is stored.
 */
function Stored({ document, source, open }: { document: WorkshopDocument; source?: string; open: string }) {
  if (document.location && document.text === undefined) {
    if (document.kind === 'video')
      return <video controls preload="none" src={served(document.location)} className="mt-3 w-full rounded" />;
    if (document.kind === 'audio')
      return <audio controls preload="none" src={served(document.location)} className="mt-3 w-full" />;
  }
  return (
    <>
      <StoredDocument document={document} source={source} />
      {document.location && document.text === undefined && (
        <a href={served(document.location)} className="mt-2 inline-block text-sm text-accent hover:underline">
          {open} →
        </a>
      )}
    </>
  );
}

function WorkshopPage() {
  const { project, writable, workshop, sources } = workshopRoute.useLoaderData();
  const { correct } = workshopRoute.useSearch();
  const { t } = useDictionaryIn(project.language);
  const here = {
    to: '/projects/$projectId/business/workshops/$workshopId',
    params: { projectId: project.id, workshopId: workshop.id },
  } as const;

  return (
    <Page
      title={workshop.title}
      back={
        <Link className={backLink} to="/projects/$projectId/business/workshops" params={{ projectId: project.id }}>
          ← {t.informal.title}
        </Link>
      }
    >
      <p className="-mt-6 text-sm text-muted">{t.informal.heldOn(workshop.date)}</p>

      <Section title={t.informal.documents(workshop.documents.length)}>
        {workshop.documents.length === 0 && <Empty>{t.informal.noDocument}</Empty>}
        {workshop.documents.map((document) => {
          const writing = writable && canWrite(document);
          const editing = writing && correct === document.id;
          const title = (
            <span className="text-sm" lang={project.language}>
              {document.title}
            </span>
          );
          const kind = <Pill>{t.documentKinds[document.kind]}</Pill>;
          // Correcting is possible, never pressed on anyone: a quiet link, once the document is open.
          const correctLink = writing && (
            <Link
              {...here}
              search={{ correct: document.id }}
              hash={document.id}
              className="text-xs text-muted hover:text-ink"
            >
              {document.text === undefined && !document.location ? t.informal.writeIt : t.informal.correct}
            </Link>
          );

          // A document stored nowhere, with nothing written, has nothing to unfold.
          if (!editing && !document.location && document.text === undefined)
            return (
              <Card key={document.id}>
                <div id={document.id} className="flex items-start justify-between gap-3">
                  {title}
                  <span className="flex items-center gap-3">
                    {correctLink}
                    {kind}
                  </span>
                </div>
              </Card>
            );

          return (
            <Card key={document.id}>
              <details id={document.id} className="group" open={editing}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-3 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start gap-2">
                    <span aria-hidden className="text-muted transition-transform group-open:rotate-90">
                      ›
                    </span>
                    {title}
                  </span>
                  {kind}
                </summary>
                {editing ? (
                  <form action={writeDocument} className="mt-3 flex flex-col gap-2">
                    <input type="hidden" name="projectId" value={project.id} />
                    <input type="hidden" name="workshopId" value={workshop.id} />
                    <input type="hidden" name="documentId" value={document.id} />
                    <MarkdownEditor
                      name="text"
                      defaultValue={document.text ?? sources[document.id] ?? ''}
                      location={document.location}
                      labels={{
                        write: t.informal.write,
                        preview: t.informal.preview,
                        placeholder: t.informal.writtenIn,
                        empty: t.informal.nothingWritten,
                      }}
                    />
                    <div className="flex items-center gap-3">
                      <Button>{t.informal.save}</Button>
                      <Link {...here} hash={document.id} className="text-sm text-muted hover:text-ink">
                        {t.informal.cancel}
                      </Link>
                    </div>
                  </form>
                ) : (
                  <>
                    <Stored document={document} source={sources[document.id]} open={t.informal.open} />
                    {correctLink && <div className="mt-2 text-right">{correctLink}</div>}
                  </>
                )}
              </details>
            </Card>
          );
        })}
        {writable && (
          <Card>
            <form action={addWorkshopDocument} className="flex flex-col gap-2">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="workshopId" value={workshop.id} />
              <Input name="title" placeholder={t.informal.documentTitle} />
              <Input name="location" placeholder={t.informal.documentLocation} required={false} />
              <div className="flex items-center gap-2">
                <Select name="kind" options={t.documentKinds} defaultValue="notes" />
                <Button quiet>{t.informal.addDocument}</Button>
              </div>
            </form>
          </Card>
        )}
      </Section>
    </Page>
  );
}

export const workshopRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'business/workshops/$workshopId',
  /** `correct`: the document being written or corrected. */
  validateSearch: (search: Record<string, unknown>): { correct?: string } =>
    typeof search.correct === 'string' ? { correct: search.correct } : {},
  loader: async ({ params }) => {
    const opened = await open(params.projectId);
    const workshop = opened.project.business.workshops.find((one) => one.id === params.workshopId);
    if (!workshop) throw notFound();
    // The documents stored among the sketch's files, read once for the page.
    const sources = Object.fromEntries(
      await Promise.all(
        workshop.documents.map(
          async (document) =>
            [document.id, isReadable(document.location) ? await readStored(document.location) : undefined] as const,
        ),
      ),
    );
    return { ...opened, workshop, sources };
  },
  component: WorkshopPage,
});
