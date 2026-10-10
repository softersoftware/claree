import { hc } from 'hono/client'
import type { Platform } from '@claree/server'
import { server } from '@/adapters'

export const { api } = hc<Platform>(window.location.origin, { fetch: server })
