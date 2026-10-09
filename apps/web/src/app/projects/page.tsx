import Link from 'next/link'
import { redirect } from 'next/navigation'
import { nameAndScope } from '@claree/domain'
import { en as t } from '@/i18n/en'
import { signedIn } from '@/session'
import { Card, Page, Section } from '../ui'

/** One of the projects of the person signed in, read as it is now. Nothing here changes it. */
export default async function ProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ address?: string }>
}) {
  const who = await signedIn()
  if (who === undefined) redirect('/')
  const address = (await searchParams).address?.trim() ?? ''
  if (address === '') redirect('/')
  const project = await who.projectFiles.open(address)
  if (project === undefined) redirect(`/?unopened=${encodeURIComponent(address)}`)
  const { name, scope } = nameAndScope(project.address, await project.read('README.md'))

  return (
    <Page title={name}>
      <p className="text-sm">
        <Link href="/" className="text-accent underline-offset-2 hover:underline">
          ← {t.overview.projects}
        </Link>
      </p>
      {scope !== '' && (
        <Section title={t.overview.scope}>
          <p className="text-sm">{scope}</p>
        </Section>
      )}
      <Section title={t.overview.repository}>
        <Card>
          <p className="text-sm break-all">
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-2 hover:underline"
              >
                {project.address}
              </a>
            ) : (
              project.address
            )}
          </p>
        </Card>
      </Section>
    </Page>
  )
}
