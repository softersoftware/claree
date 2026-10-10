import { redirect, useHref, useSearchParams } from 'react-router'
import { api } from '@/api'
import { useLanguage } from '@/language'
import { Button, Card, Page } from '@/ui'

export const signInLoader = async () => ((await api.user.$get()).ok ? redirect('/projects') : null)

/** Where GitHub sends a person back: their answer is handed to the server, and cleared from the address. */
export const callbackLoader = async () => {
  const query = Object.fromEntries(new URLSearchParams(window.location.search))
  window.history.replaceState(window.history.state, '', window.location.pathname + window.location.hash)
  const response = await api['sign-in'].callback.$post({ json: query })
  return redirect(response.ok ? '/projects' : '/?signed-in=no')
}

export function SignIn() {
  const { strings: t } = useLanguage()
  const failed = useSearchParams()[0].get('signed-in') === 'no'
  const callback = new URL(useHref('/sign-in/callback'), window.location.href).href
  const signIn = async () => {
    const response = await api['sign-in'].$post({ json: { callback } })
    if (response.ok) window.location.assign((await response.json()).address)
  }
  return (
    <Page>
      <Card>
        <p className="text-sm">{t.signingIn.needed}</p>
        <div className="mt-4">
          <Button onClick={signIn}>{t.signingIn.signIn}</Button>
        </div>
        {failed && <p className="mt-2 text-sm text-warn">{t.signingIn.failed}</p>}
      </Card>
    </Page>
  )
}
