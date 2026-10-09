import { authenticationContract } from '@claree/domain/contracts'
import { accounts } from './accounts'
import { mockAuthentication } from './mock-authentication'
import { projects } from './projects'

const logins = { 'with projects': 'ana-ruiz', 'not installed': 'tom-okafor', 'none readable': 'lea-martin' } as const

authenticationContract('the mock', async () => ({
  authentication: mockAuthentication(accounts, projects, { appName: 'Platform', port: 3902 }),
  async signedIn(account, state) {
    return { login: logins[account], state }
  },
  refused(state) {
    return { error: 'access_denied', state }
  },
}))
