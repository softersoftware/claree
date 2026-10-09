import type { SigningIn } from './signing-in'

/**
 * Every port of the platform. The mock adapters serve all of them, and so does
 * the application with its real adapters, each port taken from whichever
 * outside service answers it (ADR 0012). Projects are opened only through
 * someone signed in (ADR 0014).
 */
export interface Ports {
  readonly signingIn: SigningIn
}
