import { describe, expect, it } from 'vitest'
import { mockAdapters } from '.'

describe('the mock adapters', () => {
  it('open the invented projects', async () => {
    const opened = await mockAdapters().projectFiles.open('https://example.org/medito')
    expect(await opened?.read('README.md')).toContain('# Medito')
  })
})
