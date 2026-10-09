import { notFound } from 'next/navigation'
import { fictionalPeople } from '@/adapters'
import { productName } from '@/product'
import { GitHubPage, box, greenButton } from '../github'

/** GitHub asking the person to let the platform act in their name, as the mock adapters imitate it. */
export default async function AuthorizeOnGitHub({
  searchParams,
}: {
  searchParams: Promise<{ login?: string; state?: string }>
}) {
  if (fictionalPeople.length === 0) notFound()
  const { login = '', state = '' } = await searchParams
  const person = fictionalPeople.find((someone) => someone.login === login)
  return (
    <GitHubPage title={`Authorize ${productName}`}>
      <div className={box}>
        <p className="text-sm">
          <span className="font-semibold">{productName}</span> by{' '}
          <span className="text-[#0969da]">softersoftware</span> would like permission to:
        </p>
        <ul className="mt-3 space-y-2 border-t border-[#d1d9e0] pt-3 text-sm">
          <li>Verify your GitHub identity ({person?.login ?? login})</li>
          <li>Know which resources you can access</li>
          <li>Act on your behalf</li>
        </ul>
        <p className="mt-3 text-xs text-[#59636e]">
          Read access to code, metadata and pull requests. Read and write access to issues.
        </p>
        <form action="/sign-in/callback" className="mt-4 flex gap-2">
          <input type="hidden" name="login" value={login} />
          <input type="hidden" name="state" value={state} />
          <a
            href="/"
            className="block w-full rounded-md border border-[#d1d9e0] bg-[#f6f8fa] px-4 py-[5px] text-center text-sm font-medium hover:bg-[#eff2f5]"
          >
            Cancel
          </a>
          <button type="submit" className={greenButton}>
            Authorize {productName}
          </button>
        </form>
      </div>
      <p className="mt-4 text-center text-xs text-[#59636e]">
        Authorizing will redirect to {'/sign-in/callback'}
      </p>
    </GitHubPage>
  )
}
