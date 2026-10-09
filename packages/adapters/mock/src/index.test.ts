import { describe, expect, it } from 'vitest'
import { mockAdapters } from '.'

const adapters = mockAdapters({ appName: 'Platform', githubPort: 3901 })
const signIn = (login: string) => adapters.authentication.finish({ login })

describe('the mock adapters', () => {
  it('send a person to the mock GitHub sign-in page, which leads back to the callback', async () => {
    const start = new URL(adapters.authentication.start('http://platform/callback', 's1'))
    expect(start.origin).toBe('http://localhost:3901')
    const signInPage = await (await fetch(start)).text()
    expect(signInPage).toContain('Sign in to GitHub')
    expect(signInPage).toContain('ana-ruiz')
    const authorize = await (
      await fetch(`http://localhost:3901/authorize?login=ana-ruiz&callback=http://platform/callback&state=s1`)
    ).text()
    expect(authorize).toContain('Authorize Platform')
    expect(authorize).toContain('action="http://platform/callback"')
    expect(authorize).toContain('name="state" value="s1"')
  })

  it('serve nothing without a callback to go back to', async () => {
    expect((await fetch('http://localhost:3901/login?callback=javascript:alert(1)')).status).toBe(404)
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
