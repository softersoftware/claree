import 'server-only'
import type { Ports } from '@claree/domain'

/**
 * The platform with its real adapters. Signing in with GitHub comes after the
 * mock-up of story #29; until then, nobody signs in.
 */
export const adapters: Ports = {
  signingIn: {
    start() {
      throw new Error('Signing in with GitHub is not built yet.')
    },
    async finish() {
      return undefined
    },
  },
}

/** Nobody: people sign in with GitHub, not by being chosen. */
export const fictionalPeople: readonly { readonly login: string; readonly name: string }[] = []
