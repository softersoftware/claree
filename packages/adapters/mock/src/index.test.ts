import { describe, expect, it } from 'vitest'
import { mockAdapters } from '.'

const signIn = (login: string) => mockAdapters('/sign-in-page').authentication.finish({ login })

describe('the mock adapters', () => {
  it('send a person to the sign-in page, and back with the same state', () => {
    const at = new URL(mockAdapters('/sign-in-page').authentication.start('/back', 's1'), 'http://platform')
    expect(at.pathname).toBe('/sign-in-page')
    expect(at.searchParams.get('callback')).toBe('/back')
    expect(at.searchParams.get('state')).toBe('s1')
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

  it('sign nobody in without a known login', async () => {
    expect(await signIn('nobody')).toBeUndefined()
    expect(await mockAdapters('/sign-in-page').authentication.finish({})).toBeUndefined()
  })
})
