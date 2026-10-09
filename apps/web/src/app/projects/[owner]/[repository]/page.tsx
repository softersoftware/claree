import { redirect } from 'next/navigation'
import { nameAndScope } from '@claree/domain'
import { strings } from '@/language'
import { projectAddress } from '@/project-address'
import { currentUser } from '@/session'
import { Card, Page, Section } from '../../../ui'

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ owner: string; repository: string }>
}) {
  const t = await strings()
  const user = await currentUser()
  if (user === undefined) redirect('/')
  const { owner, repository } = await params
  const address = projectAddress(owner, repository)
  const project = await user.projectFiles.open(address)
  if (project === undefined) redirect(`/projects?${new URLSearchParams({ unopened: `${owner}/${repository}` })}`)
  const { name, scope } = nameAndScope(project.address, await project.read('README.md'))

  return (
    <Page title={name}>
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
