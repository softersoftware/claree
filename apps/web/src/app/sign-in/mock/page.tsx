import { notFound } from 'next/navigation'
import { fictionalPeople } from '@/adapters'
import { en as t } from '@/i18n/en'
import { Card, Page, Section } from '../../ui'

/** Where the mock adapters sign people in: choosing one of a few invented people stands for signing in. */
export default async function ChooseSomeone({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  if (fictionalPeople.length === 0) notFound()
  const { state = '' } = await searchParams
  return (
    <Page title={t.mock.title}>
      <Section title={t.mock.who}>
        <Card>
          <ul className="space-y-2 text-sm">
            {fictionalPeople.map(({ id, name }) => (
              <li key={id}>
                <a
                  href={`/sign-in/callback?${new URLSearchParams({ person: id, state })}`}
                  className="text-accent underline-offset-2 hover:underline"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </Section>
    </Page>
  )
}
