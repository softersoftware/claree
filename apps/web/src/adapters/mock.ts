import 'server-only'
import { accounts, mockAdapters } from '@claree/mock-adapters'
import type { Ports } from '@claree/domain'

export const adapters: Ports = mockAdapters('/sign-in/mock')

export const fictionalPeople: readonly { readonly login: string; readonly name: string }[] = accounts
