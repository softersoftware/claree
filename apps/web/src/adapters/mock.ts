import { createHashRouter } from 'react-router'
import { mockAdapters } from '@claree/mock-adapters'
import { platform, storedCookies, storedSessions } from '@claree/server'

const ports = mockAdapters({ signInPagesAt: new URL(`${import.meta.env.BASE_URL}github/`, window.location.href).href })

/** Sketches and prototypes share one site, and so one storage: each keeps its own under its path. */
const prefix = import.meta.env.BASE_URL

const app = platform(ports, {
  cookies: storedCookies(localStorage, prefix),
  sessions: storedSessions(ports.authentication, localStorage, prefix),
})

/** The server, running here in the browser (ADR 0016). */
export const server: typeof fetch = async (input, init) => app.fetch(new Request(input, init))

/** A static site serves one page for the application, so its address stays after the `#`. */
export const createRouter = createHashRouter
