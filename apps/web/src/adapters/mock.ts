import 'server-only'
import { cookies } from 'next/headers'
import { mockAdapters } from '@claree/mock-adapters'
import type { Ports } from '@claree/domain'

/**
 * The platform with no outside service at all: invented projects, held in
 * memory, and who is here kept by the visitor's own browser.
 */
export const adapters: Ports = mockAdapters(async () => {
  const jar = await cookies()
  return {
    get: (name) => jar.get(name)?.value,
    set: (name, value) => void jar.set(name, value, { path: '/' }),
    delete: (name) => void jar.delete(name),
  }
})
