import { notFound } from 'next/navigation'
import { fictionalPeople } from '@/adapters'
import { productName } from '@/product'
import { GitHubPage, box, field, greenButton } from './github'

/** Signing in on GitHub, as the mock adapters imitate it: any password, one of a few invented logins. */
export default async function SignInOnGitHub({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  if (fictionalPeople.length === 0) notFound()
  const { state = '' } = await searchParams
  return (
    <GitHubPage
      title={
        <>
          Sign in to GitHub
          <span className="block text-base text-[#59636e]">to continue to {productName}</span>
        </>
      }
    >
      <form action="/sign-in/mock/authorize" className={box}>
        <input type="hidden" name="state" value={state} />
        <label htmlFor="login" className="text-sm font-medium">
          Username or email address
        </label>
        <input id="login" name="login" list="logins" required autoFocus autoComplete="off" className={field} />
        <datalist id="logins">
          {fictionalPeople.map(({ login }) => (
            <option key={login} value={login} />
          ))}
        </datalist>
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input id="password" type="password" defaultValue="mock" className={field} />
        <button type="submit" className={greenButton}>
          Sign in
        </button>
      </form>
      <div className={`${box} mt-4 text-sm`}>
        <p className="font-medium">Fictional accounts</p>
        <ul className="mt-2 space-y-1">
          {fictionalPeople.map(({ login, name }) => (
            <li key={login}>
              <a
                href={`/sign-in/mock/authorize?${new URLSearchParams({ login, state })}`}
                className="text-[#0969da] hover:underline"
              >
                {login}
              </a>{' '}
              <span className="text-[#59636e]">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </GitHubPage>
  )
}
