import { nameAndScope } from '@claree/domain'
import { en as t } from '@/i18n/en'
import { productName } from '@/product'
import { signedIn } from '@/session'
import { Button, Card, Page, Section } from '../ui'

/** Home: the Projects page, once signed in; until then, signing in. */
export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ unopened?: string; 'signed-in'?: string }>
}) {
  const { unopened, 'signed-in': signedInNow } = await searchParams
  const who = await signedIn()

  if (who === undefined)
    return (
      <Page title={productName}>
        <Card>
          <p className="text-sm">{t.signingIn.needed}</p>
          <form action="/sign-in" method="post" className="mt-4">
            <Button>{t.signingIn.signIn}</Button>
          </form>
          {signedInNow === 'no' && <p className="mt-2 text-sm text-warn">{t.signingIn.failed}</p>}
        </Card>
      </Page>
    )

  const theirs = await who.projects()
  const refused = unopened && <p className="text-sm text-warn">{t.projects.unopened(unopened)}</p>
  if (theirs.found === 'not installed')
    return (
      <Page title={t.projects.title}>
        {refused}
        <Card>
          <p className="text-sm">{t.projects.notInstalled(productName)}</p>
          {theirs.installAt && (
            <p className="mt-3 text-sm">
              <a href={theirs.installAt} className="text-accent underline-offset-2 hover:underline">
                {t.projects.install(productName)}
              </a>
            </p>
          )}
        </Card>
      </Page>
    )
  if (theirs.found === 'none readable')
    return (
      <Page title={t.projects.title}>
        {refused}
        <Card>
          <p className="text-sm">{t.projects.noneReadable(productName)}</p>
        </Card>
      </Page>
    )

  const projects = await Promise.all(
    theirs.addresses.map(async (address) => {
      const opened = await who.projectFiles.open(address)
      return { address, ...nameAndScope(address, await opened?.read('README.md')) }
    }),
  )
  return (
    <Page title={t.projects.title}>
      {refused}
      <Section title={t.projects.count(projects.length)}>
        {projects.map(({ address, name, scope }) => (
          <a key={address} href={`/projects?${new URLSearchParams({ address })}`} className="block">
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
