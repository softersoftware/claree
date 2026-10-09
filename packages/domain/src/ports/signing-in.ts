import type { ProjectFiles } from './project-files'

/** Someone taking part in a project, as the account they signed in with names them. */
export interface Participant {
  readonly name: string
}

/** The projects someone signed in can open, by address; or, when there are none, why. */
export type TheirProjects =
  | { readonly found: 'some'; readonly addresses: readonly string[] }
  /** The platform is installed on no organisation they belong to; `installAt` is where an owner installs it. */
  | { readonly found: 'not installed'; readonly installAt?: string }
  /** The platform is installed, but on no repository they can read. */
  | { readonly found: 'none readable' }

/** A participant signed in: who they are, and what the platform opens in their name. */
export interface SignedIn {
  readonly participant: Participant
  projects(): Promise<TheirProjects>
  /** Opens only their projects. */
  readonly projectFiles: ProjectFiles
}

/**
 * Where a person says who they are. The platform keeps no account of its own:
 * the person is sent away to sign in, and comes back with what proves it.
 */
export interface SigningIn {
  /** Where to send a person to sign in; they come back to `callback`, with `state` unchanged. */
  start(callback: string, state: string): string
  /** Who came back with this proof; nothing when it proves nothing. */
  finish(proof: Readonly<Record<string, string>>): Promise<SignedIn | undefined>
}
