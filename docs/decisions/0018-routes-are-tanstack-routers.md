# 0018 — The application's routes are TanStack Router's

**Status**: accepted (2026-10); supersedes React Router in point 1 of [0016](0016-the-platform-is-a-single-page-application.md)

## Context

[0016](0016-the-platform-is-a-single-page-application.md) made the application a single-page application with React Router. Its routes work, but the compiler knows little about them:

- **A route's params are untyped.** A project's page reads `params.owner ?? ''`, as if the route could match without one.
- **Search params are plain strings**, read by hand on each page: `signed-in` on the sign-in page, `unopened` on the Projects page.
- **A link to a page that does not exist compiles.** `<Link to="/projetcs">` is found by whoever clicks it.
- **A loader's data is typed by asking for it** (`useLoaderData<typeof loader>()`), not by where the component is.

TanStack Router types all of these, from the routes themselves. It has loaders too, a way to check who is signed in before a route loads (`beforeLoad`), and a hash history for sketches and prototypes. TanStack Query, which the application will take up when a story needs caching, is made to fit inside its loaders.

The application has four routes today. Each story adds to them, and the switch costs more with every one.

## Decision

1. **The application's routes are TanStack Router's** (`@tanstack/react-router`). React Router is removed.

2. **Routes are declared in code**, with `createRoute`, in the files of the pages they lead to. The application has few routes, and code needs no generator and no generated file. File-based routing, with its Vite plugin, is chosen instead if the routes become many.

3. **Every search param a page reads is checked by its route** (`validateSearch`), and typed from there.

4. **Pages that need someone signed in say so before they load** (`beforeLoad`), and send everyone else to the sign-in page. The loaders only load.

5. **The history is chosen with the adapters, when the application is built**, as 0016 chose the router: the browser's history in production, the hash history in sketches and prototypes (`createHashHistory`), whose address stays after the `#`.

## Consequences

**Easier.** A wrong link, a missing param or a search param read with the wrong type fails to compile instead of failing in front of someone.

**Easier.** Each page reads its params, search and data typed, without saying where they come from.

**Easier.** TanStack Query, when it comes, plugs into these loaders, with the same typing.

**Harder.** The four routes, their loaders and every link are rewritten. The screens do not change.

**Harder.** Declaring routes in code is more verbose than React Router's: each route names its parent, and the router is registered once for the types to reach every link.

**Harder.** TanStack Router is younger than React Router, with fewer people using it, and fewer answers to find when something goes wrong. Its first stable version is from 2023.

## Notes

Weighed and set aside:

- **Keeping React Router, in its framework mode**: it can build a single-page application (`ssr: false`) and generates types for its routes, but it is a framework's conventions, Vite plugin and generated files to take on, and it does not check search params.
- **File-based routing now**: a plugin and a generated file for four routes. It stays the way to go if the routes become many.
