# 0016 — The platform is a single-page application, and its prototypes are static pages

**Status**: accepted (2026-10), point 7 amended to publish stories (2026-10); supersedes the stack [0004](0004-the-prototype-is-a-web-application-held-in-memory.md) chose, the consequence of [0006](0006-main-is-production-stories-and-prototypes-are-branches.md) that a prototype needs a server, point 5 of [0007](0007-production-runs-on-koyeb-from-its-own-dockerfile.md) and its open question, the consequence of [0013](0013-sketches-and-prototypes-have-their-own-branches.md) that a mock-up can be tried only from its branch, and point 2 of [0015](0015-the-mock-of-an-outside-service-serves-its-pages.md)

## Context

A prototype exists to be tried by the domain experts, and so far they cannot try one without a maker showing it. [0007](0007-production-runs-on-koyeb-from-its-own-dockerfile.md) left prototypes unhosted, and its open question already pointed at static pages, served by the repository host from a branch. [0006](0006-main-is-production-stories-and-prototypes-are-branches.md) named the cost: a prototype that runs only in the browser would have its screens restructured before reaching `main`.

The application is built with Next.js, rendered on the server, and it cannot be served as static pages. Every page reads the request: the session and the language from cookies, the language from the browser's headers. Signing in, signing out and choosing a language are request handlers that set cookies and redirect. The sessions are held in the server's memory, and the mock of GitHub's pages is a second server. Next.js can export a site as static files, but only by giving up all of that.

Rendering on the server also has costs of its own, already paid here:

- **Two worlds in one codebase.** Server components and client components, what may cross between them, and caching rules that depend on what a page calls.
- **The server must know its own address.** Behind Koyeb's proxy, it built the callback sent to GitHub from the address it listens on, and GitHub refused it.
- **The choice of adapters goes through the bundler**, in an alias only Turbopack understands.

What rendering on the server buys is a page shown before any script runs, and pages that search engines can read. Neither matters here: everything is behind signing in, used by a few people on their computers.

A server is still needed in production. [0010](0010-the-platform-acts-through-a-github-app.md) keeps the GitHub App's secret and each person's token on the server, never in the browser.

## Decision

1. **The application is a single-page application**: Vite, React, React Router and Tailwind, in `apps/web`. It renders in the browser and holds no secret. Next.js is removed.

2. **The server is an HTTP API, in `apps/server`.** It is written as one function from a web `Request` to a `Response`, with Hono, so that the same code runs in Node and in a browser. It holds the sessions and the tokens, as 0010 says, and chooses the domain's adapters when it is built, as [0012](0012-adapters-are-packaged-by-outside-service.md) says. Outside its Node entry point, it uses only what both Node and browsers provide: Web Crypto, not `node:crypto`.

3. **In production, one image and one address.** The server answers under `/api/` and serves the application's files at every other address. The session is an `httpOnly` cookie on that one address, with no cross-origin requests. 0007 is otherwise unchanged: the Dockerfile, on Koyeb.

4. **The application reaches the server through one function, `(request: Request) => Promise<Response>`.** In production it is `fetch`. In a sketch or a prototype, it is the server itself, built with the mock adapters, running in the browser. The screens are the same code in both. What the server keeps between two requests is kept in the browser's storage there, so that reloading the page does not sign out.

5. **The callback of signing in is a page of the application.** It hands GitHub's code and state to the server, which exchanges them for a token. The flow is the same in production and in a prototype, and the callback's address is the page's own, so the server no longer needs to know it.

6. **The pages of GitHub that the mock imitates are static HTML files of `@claree/mock-adapters`**, served beside the application in development and in prototypes. Point 2 of 0015 is replaced: there is no second server. The rest of 0015 holds: the pages are in the mock package, never in the application.

7. **Sketches, prototypes and stories are published on this repository's GitHub Pages**, one site for all of them. A workflow builds every `sketches/*`, `prototypes/*` and `stories/*` branch with `CLAREE_ADAPTERS=mock` on every push to one of them, and whenever a branch is deleted, each under its branch's path (`/prototypes/0.2/`), and publishes the whole. A story is published so that its mock-up can be tried before it is built, as 0013 makes it on the story's branch (amended 2026-10). Their router keeps the page in the address's fragment (`#/projects`), because GitHub Pages cannot send every address to the same page; production keeps plain addresses. The router is chosen with the adapters, when the application is built.

8. **The sketches made before this decision are not published.** They stay as they were shown, built with Next.js and tried locally, as 0013 asks.

9. **This decides the platform's stack, not the one the generator produces.** 0004 chose the platform's stack as the one it would generate. A project whose pages must be found by search engines needs them rendered in advance or on a server. What the generator produces for a project is decided when the generator exists.

## Consequences

**Easier.** A prototype is a link. A domain expert tries it alone, when they like, and it costs nothing to host.

**Easier.** A story takes a prototype's screens as they are, as 0013 asks: they are already the application's screens, with the same server behind them.

**Easier.** One way of rendering, in the browser. No server and client components, no hidden cache, no server guessing its own address, and the adapters are chosen without a bundler's alias.

**Easier.** `pnpm dev:mock` starts one server, the application's, as 0015 hoped.

**Harder.** Two programs instead of one. What the server answers is a contract with the screens; both live in this repository and ship in one image, so production never runs them out of step, but a change to one is checked against the other.

**Harder.** Every screen shows its own loading and its own errors, which the server used to hide by sending a finished page.

**Harder.** The server's code must also run in a browser. A Node-only module outside its entry point breaks every prototype.

**Harder.** Nothing shows until the script has loaded. Acceptable for a tool used signed in, on a computer.

**Harder.** Prototypes on GitHub Pages are public: anyone with the address can try them. This repository is public and they show invented data only, so nothing is exposed here. A private project would need another host, and that decision is its own.

**Harder.** The application is rewritten. It has three pages and four routes today, and will never be cheaper to rewrite.

**Harder.** A prototype whose branch is deleted disappears from the site at the next publication. Sketches are never deleted, so they stay. A story disappears once it is merged and its branch deleted: it is then the application itself.

**Harder.** Every push to one of these branches builds them all again. Cheap while a few are open; building only the branch that changed is left for when it is not.

## Notes

Hono is chosen for the server because it is built on `Request`, `Response` and `fetch`, not on Node's own objects: the whole server is one function, `app.fetch`, which runs in Node and in a browser alike, where Express runs in Node only. It has no dependency of its own and weighs a few kilobytes, which matters in a server shipped inside every prototype. It brings what the server would otherwise write by hand: routing, cookies, and, through `@hono/node-server`, the Node entry point and the application's static files. Its typed client, `hc`, gives the screens the server's routes and answers as types, which narrows the contract between the two programs.

Weighed and set aside:

- **Next.js with `output: 'export'`**: static files, but with every request-time feature switched off, and failures that show in `next build` and not in `next dev`. It keeps the framework's conventions without what they are for.
- **Hosting each prototype as a server**, on Koyeb beside production, or as previews per branch on Vercel: prototypes stay built like today's application, but every prototype needs a running server and its mock pages put online, and Vercel's free plan excludes commercial use.
- **The mock server behind a service worker**, catching the application's requests: a service worker cannot set cookies, so the session would need a second mechanism anyway. Calling the server as a function is simpler.
- **Plain functions from `Request` to `Response`, with no framework**: possible for a handful of routes, but the routing, the cookies, the Node entry point and the static files would all be written and tested here.
