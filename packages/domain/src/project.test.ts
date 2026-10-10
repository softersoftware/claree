import { describe, expect, it } from 'vitest';
import { nameAndScope, repositoryLink } from './project';

describe('name and scope', () => {
  const address = 'https://example.org/medito';

  it('reads the title of the README as the name, and the first paragraph under it as the scope', () => {
    const readme = '# Medito\n\nBooking sessions\nat a meditation centre.\n\nNothing else.\n';
    expect(nameAndScope(address, readme)).toEqual({
      name: 'Medito',
      scope: 'Booking sessions at a meditation centre.',
    });
  });

  it('names a project with no README by its address, with an empty scope', () => {
    expect(nameAndScope(address, undefined)).toEqual({ name: address, scope: '' });
  });

  it('names a project whose README has no title by its address', () => {
    expect(nameAndScope(address, 'Booking sessions.\n')).toEqual({ name: address, scope: '' });
  });

  it('leaves the scope empty when no paragraph comes before the next heading', () => {
    expect(nameAndScope(address, '# Medito\n\n## Rooms\n\nThree rooms.\n')).toEqual({
      name: 'Medito',
      scope: '',
    });
  });

  it('keeps the title as written, without the closing hashes', () => {
    expect(nameAndScope(address, '# Clarée #\n').name).toBe('Clarée');
  });
});

describe('the link to a repository', () => {
  it('is its address, when a browser can open it', () => {
    expect(repositoryLink('https://example.org/medito')).toBe('https://example.org/medito');
  });

  it('is nothing for a repository on this machine', () => {
    expect(repositoryLink('/home/maker/medito')).toBeUndefined();
    expect(repositoryLink('file:///home/maker/medito')).toBeUndefined();
  });

  it('is nothing for an address that does not start with https://', () => {
    expect(repositoryLink('http://example.org/medito')).toBeUndefined();
    expect(repositoryLink('ssh://git@example.org/medito.git')).toBeUndefined();
    expect(repositoryLink('javascript://%0Aalert(1)')).toBeUndefined();
    expect(repositoryLink(' https://example.org/medito')).toBeUndefined();
  });
});
