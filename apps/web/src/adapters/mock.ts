import 'server-only'
import { mockAdapters } from '@claree/mock-adapters'
import type { Ports } from '@claree/domain'
import { productName } from '@/product'

export const adapters: Ports = mockAdapters({ appName: productName })
