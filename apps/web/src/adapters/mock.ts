import 'server-only'
import { mockAdapters, people } from '@claree/mock-adapters'
import type { Ports } from '@claree/domain'

/** The platform with no outside service at all: invented people and projects, held in memory. */
export const adapters: Ports = mockAdapters('/sign-in/mock')

/** Who can be chosen at `/sign-in/mock`, where the real sign-in page would be. */
export const fictionalPeople: readonly { readonly login: string; readonly name: string }[] = people
