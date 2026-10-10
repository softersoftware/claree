import { describe, expect, it } from 'vitest';

/**
 * The glossary bridge says which name each term has in the code. These tests
 * read it as text, with the code, so that the two cannot drift apart.
 */

const glossary =
  Object.values(
    import.meta.glob('../../../docs/glossary_bridge.md', { query: '?raw', import: 'default', eager: true }),
  )[0] ?? '';

const rules = import.meta.glob(
  ['./**/*.ts', '!**/*.test.ts', '!**/*.contract.ts', '!**/*.d.ts', '!./contracts.ts', '!./index.ts'],
  { query: '?raw', import: 'default', eager: true },
);

const application = import.meta.glob('../../../apps/web/src/**/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/** The code without its comments, where a word proves nothing. */
const code = [...Object.values(rules), ...Object.values(application)]
  .join('\n')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

/** Every row of the glossary: a term, and its names in the code. */
const rows = glossary
  .split('\n')
  .filter((line) => line.startsWith('| ') && !line.startsWith('| ---') && !line.startsWith('| Business term'))
  .map((line) => {
    const [term = '', names = ''] = line
      .split('|')
      .slice(1)
      .map((cell) => cell.trim());
    return { term, names: [...names.matchAll(/`([^`]+)`/g)].map((match) => match[1] ?? '') };
  });

const appearsIn = (text: string, word: string) => new RegExp(`\\b${word}\\b`).test(text);

describe('the glossary', () => {
  it('has a name in the code on every row', () => {
    expect(rows.filter((row) => row.names.length === 0).map((row) => row.term)).toEqual([]);
  });

  it('names only what exists in the code', () => {
    const absent = rows
      .flatMap((row) => row.names)
      .filter((name) => name.split('.').some((part) => !appearsIn(code, part)));
    expect(absent).toEqual([]);
  });

  it('is read in full', () => {
    expect(rows.length).toBeGreaterThan(0);
    expect(Object.keys(application).length).toBeGreaterThan(0);
  });
});
