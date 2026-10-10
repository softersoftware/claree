import { type LoaderFunctionArgs, redirect, useLoaderData } from 'react-router'
import { api } from '@/api'
import { useLanguage } from '@/language'
import { Card, Page, Section } from '@/ui'

export const projectLoader = async ({ params }: LoaderFunctionArgs) => {
  const { owner = '', repository = '' } = params
  const response = await api.projects[':owner'][':repository'].$get({ param: { owner, repository } })
  if (response.status === 401) return redirect('/')
  if (!response.ok) return redirect(`/projects?${new URLSearchParams({ unopened: `${owner}/${repository}` })}`)
  return response.json()
}

export function Project() {
  const { strings: t } = useLanguage()
  const { name, scope, address, link } = useLoaderData<typeof projectLoader>()
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
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-2 hover:underline"
              >
                {address}
              </a>
            ) : (
              address
            )}
          </p>
        </Card>
      </Section>
    </Page>
  )
}
