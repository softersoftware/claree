import 'server-only'
import type { Ports } from '@claree/domain'

/** Signing in with GitHub comes after the mock-up of story #29. */
export const adapters: Ports = {
  authentication: {
    start() {
      throw new Error('Signing in with GitHub is not built yet.')
    },
    async finish() {
      return undefined
    },
  },
}

export const fictionalPeople: readonly { readonly login: string; readonly name: string }[] = []
