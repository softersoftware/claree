import { redirect } from 'next/navigation'
import { en as t } from '@/i18n/en'
import { productName } from '@/product'
import { currentUser } from '@/session'
import { Button, Card, Page } from './ui'

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ 'signed-in'?: string }>
}) {
  if (await currentUser()) redirect('/projects')
  const failed = (await searchParams)['signed-in'] === 'no'
  return (
    <Page title={productName}>
      <Card>
        <p className="text-sm">{t.signingIn.needed}</p>
        <form action="/sign-in" method="post" className="mt-4">
          <Button>{t.signingIn.signIn}</Button>
        </form>
        {failed && <p className="mt-2 text-sm text-warn">{t.signingIn.failed}</p>}
      </Card>
    </Page>
  )
}
