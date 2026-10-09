import { redirect } from 'next/navigation'
import { nameAndScope } from '@claree/domain'
import { en as t } from '@/i18n/en'
import { productName } from '@/product'
import { projectPage } from '@/project-address'
import { currentUser } from '@/session'
import { Card, Page, Section } from '../ui'

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ unopened?: string }> }) {
  const user = await currentUser()
  if (user === undefined) redirect('/')
  const { unopened } = await searchParams
  const refused = unopened && <p className="text-sm text-warn">{t.projects.unopened(unopened)}</p>

  const projects = await user.projects()
  if (projects.found === 'not installed')
    return (
      <Page title={t.projects.title}>
        {refused}
        <Card>
          <p className="text-sm">{t.projects.notInstalled(productName)}</p>
          {projects.installAt && (
            <p className="mt-3 text-sm">
              <a href={projects.installAt} className="text-accent underline-offset-2 hover:underline">
                {t.projects.install(productName)}
              </a>
            </p>
          )}
        </Card>
      </Page>
    )
  if (projects.found === 'none readable')
    return (
      <Page title={t.projects.title}>
        {refused}
        <Card>
          <p className="text-sm">{t.projects.noneReadable(productName)}</p>
        </Card>
      </Page>
    )

  const cards = await Promise.all(
    projects.addresses.map(async (address) => {
      const repository = await user.projectFiles.open(address)
      return { address, ...nameAndScope(address, await repository?.read('README.md')) }
    }),
  )
  return (
    <Page title={t.projects.title}>
      {refused}
      <Section title={t.projects.count(cards.length)}>
        {cards.map(({ address, name, scope }) => (
          <a key={address} href={projectPage(address)} className="block">
            <Card>
              <p className="text-sm font-semibold">{name}</p>
              {scope !== '' && <p className="mt-1 text-sm text-muted">{scope}</p>}
            </Card>
          </a>
        ))}
      </Section>
    </Page>
  )
}
