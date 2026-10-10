import { createHashHistory } from '@tanstack/react-router';
import { mockAdapters } from '@claree/mock-adapters';
import { apiServer, storedCookies, storedKey } from '@claree/server';

const ports = mockAdapters({ signInPagesAt: new URL(`${import.meta.env.BASE_URL}github/`, window.location.href).href });

/** Sketches and prototypes share one site, and so one storage: each stores its own under its path. */
const prefix = import.meta.env.BASE_URL;

const app = apiServer(ports, { key: storedKey(localStorage, prefix), cookies: storedCookies(localStorage, prefix) });

/** The server, running here in the browser (ADR 0016). */
export const server: typeof fetch = async (input, init) => app.fetch(new Request(input, init));

/** A static site serves one page for the application, so its address stays after the `#`. */
/**
 * GitHub sends its answer back before the `#`, where the router does not look: it is moved after it, as the
 * callback's search, before the router starts.
 */
if (window.location.search !== '') {
  const [route = '/', search = ''] = window.location.hash.slice(1).split('?');
  const answer = new URLSearchParams(search);
  for (const [name, value] of new URLSearchParams(window.location.search)) answer.set(name, value);
  window.history.replaceState(window.history.state, '', `${window.location.pathname}#${route}?${answer}`);
}

export const history = createHashHistory();
