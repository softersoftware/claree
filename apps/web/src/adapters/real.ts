import 'server-only'
import { githubAuthentication } from '@claree/github-adapters'
import type { Ports } from '@claree/domain'

export const adapters: Ports = {
  authentication: githubAuthentication({
    clientId: process.env.GITHUB_APP_CLIENT_ID ?? '',
    clientSecret: process.env.GITHUB_APP_CLIENT_SECRET ?? '',
    appSlug: process.env.GITHUB_APP_SLUG ?? '',
  }),
}
