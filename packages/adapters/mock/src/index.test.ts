import { describe, expect, it } from 'vitest'
import { mockAdapters, mockSignInFiles } from '.'

const adapters = mockAdapters({ signInPagesAt: 'http://platform/github/' })
const signIn = (login: string) => adapters.authentication.finish({ login })

describe('the mock adapters', () => {
  it('send a person to the mock GitHub sign-in page, with the callback and the state', () => {
    const start = new URL(adapters.authentication.start('http://platform/callback', 's1'))
    expect(start.origin + start.pathname).toBe('http://platform/github/login.html')
    expect(start.searchParams.get('callback')).toBe('http://platform/callback')
    expect(start.searchParams.get('state')).toBe('s1')
  })

  it('imitate the sign-in page, with every account, and the authorization page that leads back', () => {
    const pages = mockSignInFiles('Platform')
    expect(pages['login.html']).toContain('Sign in to GitHub')
    expect(pages['login.html']).toContain('data-login="ana-ruiz"')
    expect(pages['authorize.html']).toContain('Authorize Platform')
    expect(pages['authorize.html']).toContain("access_denied")
  })

  it('go nowhere without a callback a browser can go back to', () => {
    for (const page of Object.values(mockSignInFiles('Platform'))) expect(page).toContain("'Not found'")
  })

  it('sign in to an account with projects, and open only those', async () => {
    const ana = await signIn('ana-ruiz')
    expect(ana?.name).toBe('Ana Ruiz')
    expect(await ana?.projects()).toEqual({
      found: 'some',
      addresses: ['https://github.com/medito-centre/medito', 'https://github.com/greenlane-gardens/allotments'],
    })
    const opened = await ana?.projectFiles.open('https://github.com/medito-centre/medito')
    expect(await opened?.read('README.md')).toContain('# Medito')
  })

  it('sign in to an account whose organisations have not installed the platform', async () => {
    const tom = await signIn('tom-okafor')
    expect(await tom?.projects()).toEqual({ found: 'not installed' })
    expect(await tom?.projectFiles.open('https://github.com/medito-centre/medito')).toBeUndefined()
  })

  it('sign in to an account that can read no repository where it is installed', async () => {
    expect(await (await signIn('lea-martin'))?.projects()).toEqual({ found: 'none readable' })
  })

  it('sign nobody in without a known login, or when the authorization is cancelled', async () => {
    expect(await signIn('nobody')).toBeUndefined()
    expect(await adapters.authentication.finish({ error: 'access_denied' })).toBeUndefined()
  })
})
