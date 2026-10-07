import 'server-only'
import { gitProjectFiles } from '@claree/git-adapters'
import type { Ports } from '@claree/domain'

/**
 * The platform with its real adapters: projects read from their repositories,
 * and repositories on this machine only outside production.
 */
export const adapters: Ports = {
  projectFiles: gitProjectFiles({ local: process.env.NODE_ENV !== 'production' }),
}
