import { describe, expect, it } from 'vitest'
import { mockAdapters } from '.'

const signedInAs = (person: string) => mockAdapters('/choose').signingIn.finish({ person })

describe('the mock adapters', () => {
  it('send a person to choose who they are, and back with the same state', () => {
    const at = new URL(mockAdapters('/choose').signingIn.start('/back', 's1'), 'http://platform')
    expect(at.pathname).toBe('/choose')
    expect(at.searchParams.get('callback')).toBe('/back')
    expect(at.searchParams.get('state')).toBe('s1')
  })

  it('sign in as someone with projects, and open only theirs', async () => {
    const ana = await signedInAs('ana')
    expect(ana?.participant.name).toBe('Ana Ruiz')
    expect(await ana?.projects()).toEqual({
      found: 'some',
      addresses: ['https://example.org/medito', 'https://example.org/allotments'],
    })
    const opened = await ana?.projectFiles.open('https://example.org/medito')
    expect(await opened?.read('README.md')).toContain('# Medito')
  })

  it('sign in as someone no project has let the platform in for', async () => {
    const tom = await signedInAs('tom')
    expect(await tom?.projects()).toEqual({ found: 'not let in' })
    expect(await tom?.projectFiles.open('https://example.org/medito')).toBeUndefined()
  })

  it('sign in as someone no project recognises', async () => {
    expect(await (await signedInAs('lea'))?.projects()).toEqual({ found: 'none recognises them' })
  })

  it('sign nobody in without a person they know', async () => {
    expect(await signedInAs('nobody')).toBeUndefined()
    expect(await mockAdapters('/choose').signingIn.finish({})).toBeUndefined()
  })
})
