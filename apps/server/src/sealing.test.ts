import { describe, expect, it } from 'vitest';
import { keyFrom, sealing } from './sealing';

const randomKey = () => crypto.getRandomValues(new Uint8Array(32));

describe('the session key', () => {
  it('is 32 bytes in base64', () => {
    expect(keyFrom(btoa('k'.repeat(32))).length).toBe(32);
  });

  it('is refused, saying how to make one, when it is missing, of another length, or not base64', () => {
    for (const text of ['', btoa('k'.repeat(16)), btoa('k'.repeat(64)), 'not base64!', '_-_-'])
      expect(() => keyFrom(text)).toThrow('openssl rand -base64 32');
  });
});

describe('a sealed session', () => {
  it('opens with the key it was sealed with', async () => {
    const { seal, open } = sealing(randomKey());
    expect(await open(await seal('credentials'))).toBe('credentials');
  });

  it('opens with no other key, and not once changed', async () => {
    const { seal, open } = sealing(randomKey());
    const sealed = await seal('credentials');
    expect(await sealing(randomKey()).open(sealed)).toBeUndefined();
    expect(await open(`${sealed.slice(0, -2)}AA`)).toBeUndefined();
    expect(await open('forged')).toBeUndefined();
  });
});
