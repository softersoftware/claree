import { describe, expect, it } from 'vitest'
import { mockAdapters } from '.'

const signedInAs = (login: string) => mockAdapters('/choose').signingIn.finish({ login })

describe('the mock adapters', () => {
  it('send a person to choose who they are, and back with the same state', () => {
    const at = new URL(mockAdapters('/choose').signingIn.start('/back', 's1'), 'http://platform')
    expect(at.pathname).toBe('/choose')
    expect(at.searchParams.get('callback')).toBe('/back')
    expect(at.searchParams.get('state')).toBe('s1')
  })

  it('sign in as someone with projects, and open only theirs', async () => {
    const ana = await signedInAs('ana-ruiz')
    expect(ana?.participant.name).toBe('Ana Ruiz')
    expect(await ana?.projects()).toEqual({
      found: 'some',
      addresses: ['https://github.com/medito-centre/medito', 'https://github.com/greenlane-gardens/allotments'],
    })
    const opened = await ana?.projectFiles.open('https://github.com/medito-centre/medito')
    expect(await opened?.read('README.md')).toContain('# Medito')
  })

  it('sign in as someone whose organisations have not installed the platform', async () => {
    const tom = await signedInAs('tom-okafor')
    expect(await tom?.projects()).toEqual({ found: 'not installed' })
    expect(await tom?.projectFiles.open('https://github.com/medito-centre/medito')).toBeUndefined()
  })

  it('sign in as someone who can read no repository where it is installed', async () => {
    expect(await (await signedInAs('lea-martin'))?.projects()).toEqual({ found: 'none readable' })
  })

  it('sign nobody in without a person they know', async () => {
    expect(await signedInAs('nobody')).toBeUndefined()
    expect(await mockAdapters('/choose').signingIn.finish({})).toBeUndefined()
  })
})
