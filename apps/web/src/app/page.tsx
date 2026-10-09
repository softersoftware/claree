import Link from 'next/link'
import { mayOpen, projectsFor } from '@claree/domain'
import type { Account, AvailableProject } from '@claree/domain'
import { currentLocale, dictionaryOf, languageName } from '@/i18n'
import type { Dictionary, Locale } from '@/i18n'
import { adapters } from '@/adapters'
import { productName } from '@/product'
import { arrive, openByAddress, removeProject } from './arrival-actions'
import { Button, Card, Empty, Input, Page, Pill, Section } from './ui'

function ProjectRow({
  project,
  account,
  language,
  locale,
  t,
}: {
  project: AvailableProject
  account?: Account
  /** Known only once the project has been read. */
  language?: string
  locale: Locale
  t: Dictionary
}) {
  const open = mayOpen(project, account)
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          {open ? (
            <Link
              href={`/projects/${project.id}`}
              className="text-sm font-medium hover:text-accent"
            >
              {project.name}
            </Link>
          ) : (
            <p className="text-sm font-medium text-muted">{project.name}</p>
          )}
          <p className="mt-1 text-sm text-muted">
            {project.isPublic ? t.publicProject : t.privateProject}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {language && <Pill>{t.writtenIn(languageName(language, locale))}</Pill>}
          <form action={removeProject}>
            <input type="hidden" name="projectId" value={project.id} />
            <button type="submit" className="text-sm text-muted hover:text-ink">
              {t.arrival.remove}
            </button>
          </form>
        </div>
      </div>
    </Card>
  )
}

/** The other way in: a project's address, which asks nothing of anyone. */
function OpenByAddress({ unknown, t }: { unknown?: string; t: Dictionary }) {
  return (
    <Section title={t.arrival.addProject}>
      <Card>
        <form action={openByAddress} className="flex flex-col gap-2 sm:flex-row">
          <Input
          name="address"
          placeholder="https://github.com/softersoftware/claree"
          label={t.arrival.projectAddress}
        />
          <Button quiet>{t.arrival.openIt}</Button>
        </form>
        {unknown && <p className="mt-2 text-sm text-warn">{t.arrival.unknown(unknown)}</p>}
      </Card>
    </Section>
  )
}

export default async function ArrivalPage({
  searchParams,
}: {
  searchParams: Promise<{ unknown?: string }>
}) {
  const { unknown } = await searchParams
  const locale = await currentLocale()
  const t = dictionaryOf(locale)
  const account = await adapters.arrivals.whoIsHere()
  const added = await adapters.arrivals.addedProjects()
  const projects = projectsFor(await adapters.projectStore.available(account), added, account)
  const languages = new Map(
    await Promise.all(
      projects.map(
        async (project) => [project.id, (await adapters.projectStore.load(project.id))?.language] as const,
      ),
    ),
  )

  return (
    <Page title={account ? undefined : productName}>
      {!account && (
        <Card>
          <form action={arrive}>
            <Button>{t.arrival.signIn}</Button>
          </form>
        </Card>
      )}

      {(account || projects.length > 0) && (
        <Section title={t.arrival.yourProjects(projects.length)}>
          {projects.length === 0 && <Empty>{t.arrival.nothingAdded}</Empty>}
          {projects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              account={account}
              language={languages.get(project.id)}
              locale={locale}
              t={t}
            />
          ))}
        </Section>
      )}

      <OpenByAddress unknown={unknown} t={t} />
    </Page>
  )
}
