/**
 * Where people reach the platform. Behind a proxy, the server listens on an
 * address of its own (`0.0.0.0:8000`); the proxy says the public one.
 */
export const publicOrigin = (request: Request) => {
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  const protocol = request.headers.get('x-forwarded-proto') ?? new URL(request.url).protocol.replace(':', '')
  return host === null ? new URL(request.url).origin : `${protocol}://${host}`
}

/** A redirection within the platform, relative so that it never depends on the address the server listens on. */
export const redirectTo = (path: string) => new Response(null, { status: 303, headers: { location: path } })
