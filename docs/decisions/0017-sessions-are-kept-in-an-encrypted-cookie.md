# 0017 — Sessions are kept in an encrypted cookie, not on the server

**Status**: accepted (2026-10); supersedes point 6 of [0010](0010-the-platform-acts-through-a-github-app.md) on where the token is held, and what [0016](0016-the-platform-is-a-single-page-application.md) says the server holds (point 2) and keeps in the browser's storage in a prototype (point 4)

## Context

The server keeps every session in its memory: the person's name, and the GitHub token it acts with, which [0010](0010-the-platform-acts-through-a-github-app.md) keeps out of the browser. A browser holds only a random id, in a cookie.

That has a cost every time production changes. [0007](0007-production-runs-on-koyeb-from-its-own-dockerfile.md) redeploys on every merge to `main`, and every redeploy empties that memory: everyone using the platform is signed out, several times a day. It also keeps production to one instance, since a second one would know nobody.

Keeping sessions elsewhere on the server side means a database or a cache, and [0007](0007-production-runs-on-koyeb-from-its-own-dockerfile.md) runs the platform with none.

Sessions hold nothing else. Who is signed in is a name, a token that lasts eight hours, and a refresh token that lasts six months and is replaced each time it is used.

A signed token, such as a JSON Web Token, would need no state either, but anyone holding it can read it, token included. 0010 forbids that.

## Decision

1. **The session is a cookie the server encrypts**, as a JSON Web Encryption (direct key, AES-256-GCM), with `jose`, which runs in Node and in a browser alike. It holds the person's name, and what the authentication needs to act again in their name: for GitHub, the token, when it expires, and the refresh token. The cookie stays `httpOnly`, `Secure` and `SameSite=Lax`, on the platform's one address.

2. **The server keeps nothing between two requests.** It decrypts the cookie, and the authentication rebuilds the `User` from it. The port `Authentication` says so: signing in gives the user and what to keep, and resuming from what was kept gives the user again, or nothing. Its contract tests both, for the mock as for GitHub.

3. **The cookie is issued again whenever what it holds changes.** When GitHub renews the token, the old token and the old refresh token stop working, so the server sends the new ones back in a new cookie with its answer.

4. **The key is a secret of production**, `CLAREE_SESSION_KEY`, 32 random bytes, set on the host beside the GitHub App's secrets. Changing it signs everyone out, and it is changed only if it may have leaked.

5. **A session lasts as long as GitHub's refresh token**, six months, renewed with it. Signing out deletes the cookie and revokes the token on GitHub (`DELETE /applications/{client_id}/token`), so that a copy of the cookie taken before is worth nothing after.

6. **In a sketch or a prototype, the cookie is kept in the browser's storage**, as other cookies are there ([0016](0016-the-platform-is-a-single-page-application.md)), encrypted with a key made in the browser on first use and kept beside it. The sessions kept in storage are deleted.

## Consequences

**Easier.** Deploying no longer signs anyone out. A restart, a new version, or a move to another host leaves everyone signed in.

**Easier.** Production can run more than one instance: any of them reads any session.

**Easier.** The server running in a prototype keeps nothing of its own. The sessions kept in storage, and the replaying of a sign-in they needed, go away.

**Harder.** The GitHub token now travels to the browser and back on every request, encrypted. Whoever has the key and a cookie can read it. The key is held like the GitHub App's secret, and never logged.

**Harder.** A cookie stolen before signing out works until GitHub's token is revoked, and one stolen without signing out works until the token is renewed. Renewing every eight hours bounds it.

**Harder.** Two requests renewing the same token at once race: GitHub accepts the first, and the second, holding the replaced refresh token, fails, and the person is signed out. The token is already renewed a minute before it expires, which makes this rare. Should it happen, signing in again is the remedy.

**Harder.** `Authentication` changes shape, and both adapters with it. The contract says what both must do, before either changes.

## Notes

Weighed and set aside:

- **A signed token (JSON Web Signature)**: readable by whoever holds it, so it cannot hold the GitHub token, and the token would have to stay on the server anyway.
- **A store for sessions on the server side** (a database, a cache): it keeps sessions across deploys, but adds a service to run, which 0007 avoids, for what one cookie holds.
- **Encrypting by hand with Web Crypto**: possible in a few lines, but `jose` gives a standard format, checked expiry and tested code for the same small dependency.
