import { EncryptJWT, jwtDecrypt } from 'jose';

/** As long as GitHub's refresh token, renewed with it (ADR 0017). */
export const sessionLifetime = 180 * 24 * 60 * 60;

/** A session's cookie, encrypted with `key` so that only the server reads its credentials (ADR 0017). */
export const sealing = (key: Uint8Array) => ({
  seal: (credentials: string) =>
    new EncryptJWT({ credentials })
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .setIssuedAt()
      .setExpirationTime(`${sessionLifetime}s`)
      .encrypt(key),
  /** The credentials in the cookie; nothing when it was sealed with another key, changed, or expired. */
  async open(cookie: string): Promise<string | undefined> {
    try {
      const { payload } = await jwtDecrypt(cookie, key);
      return typeof payload.credentials === 'string' ? payload.credentials : undefined;
    } catch {
      return undefined;
    }
  },
});

/** A key from its text, as `CLAREE_SESSION_KEY` holds it: 32 random bytes in base64. */
export const keyFrom = (text: string): Uint8Array => {
  const invalid = new Error('CLAREE_SESSION_KEY must be 32 random bytes in base64: openssl rand -base64 32');
  let bytes: string;
  try {
    bytes = atob(text);
  } catch {
    throw invalid;
  }
  if (bytes.length !== 32) throw invalid;
  return Uint8Array.from(bytes, (character) => character.charCodeAt(0));
};
