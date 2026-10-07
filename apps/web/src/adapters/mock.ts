import 'server-only'
import { mockAdapters } from '@claree/mock-adapters'
import type { Ports } from '@claree/domain'

/** The platform with no outside service at all: invented projects, held in memory. */
export const adapters: Ports = mockAdapters()
