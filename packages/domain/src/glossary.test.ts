import { describe, expect, it } from 'vitest'

/**
 * The glossary says which name each term has in the code. These tests read it
 * as text, with the domain documents and the code, so that it cannot drift
 * from either.
 */

const glossary =
  Object.values(
    import.meta.glob('../../../docs/glossary.md', { query: '?raw', import: 'default', eager: true }),
  )[0] ?? ''

const domains = import.meta.glob(['../../../docs/domain/*.md', '!**/README.md'], {
  query: '?raw',
  import: 'default',
  eager: true,
})

const rules = import.meta.glob(
  ['./**/*.ts', '!**/*.test.ts', '!**/*.contract.ts', '!**/*.d.ts', '!./contracts.ts', '!./index.ts'],
  { query: '?raw', import: 'default', eager: true },
)

const application = import.meta.glob('../../../apps/web/src/**/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
})

/** The code without its comments, where a word proves nothing. */
const code = [...Object.values(rules), ...Object.values(application)]
  .join('\n')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '')

/** Every row of the glossary: a term, and its names in the code. */
const rows = glossary
  .split('\n')
  .filter((line) => line.startsWith('| ') && !line.startsWith('| ---') && !line.startsWith('| Business term'))
  .map((line) => {
    const [term = '', names = ''] = line.split('|').slice(1).map((cell) => cell.trim())
    return { term, names: [...names.matchAll(/`([^`]+)`/g)].map((match) => match[1] ?? '') }
  })

/** Every term a domain's glossary defines: the bold words before the colon of each entry. */
const definedTerms = Object.entries(domains).flatMap(([file, text]) => {
  const section = text.split(/^## /m).find((part) => part.startsWith('Glossary')) ?? ''
  return section
    .split('\n')
    .filter((line) => line.startsWith('- **'))
    .flatMap((line) => [...(line.split(':')[0] ?? '').matchAll(/\*\*([^*]+)\*\*/g)])
    .map((match) => ({ file, term: match[1] ?? '' }))
})

const exported = Object.values(rules).flatMap((text) =>
  [...text.matchAll(/^export (?:interface|type|const|function) (\w+)/gm)].map((match) => match[1] ?? ''),
)

const appearsIn = (text: string, word: string) => new RegExp(`\\b${word}\\b`).test(text)

describe('the glossary', () => {
  it('has a row for every term a domain defines', () => {
    const named = new Set(rows.map((row) => row.term.toLowerCase()))
    const missing = definedTerms.filter(({ term }) => !named.has(term.toLowerCase()))
    expect(missing).toEqual([])
  })

  it('names only what exists in the code', () => {
    const absent = rows
      .flatMap((row) => row.names)
      .filter((name) => name.split('.').some((part) => !appearsIn(code, part)))
    expect(absent).toEqual([])
  })

  it('has a row for every name the domain exports', () => {
    const named = new Set(rows.flatMap((row) => row.names.map((name) => name.split('.')[0])))
    expect(exported.filter((name) => !named.has(name))).toEqual([])
  })

  it('is read in full', () => {
    expect(Object.keys(domains).length).toBeGreaterThan(0)
    expect(exported.length).toBeGreaterThan(0)
    expect(Object.keys(application).length).toBeGreaterThan(0)
  })
})
