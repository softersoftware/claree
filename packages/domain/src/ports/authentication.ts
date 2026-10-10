import type { ProjectFiles } from './project-files';

export type ProjectList =
  | { readonly found: 'some'; readonly addresses: readonly string[] }
  /** `installAt`: where an owner of an organisation installs the platform. */
  | { readonly found: 'not installed'; readonly installAt?: string }
  | { readonly found: 'none readable' };

/** The person signed in, and what the platform can open in their name. */
export type User = {
  readonly name: string;
  projects(): Promise<ProjectList>;
  /** Opens only the user's projects. */
  readonly projectFiles: ProjectFiles;
};

/** A user signed in, and the credentials that sign them in again (ADR 0017). */
export type Session = {
  readonly user: User;
  /** What `resume` signs the user in again with. They change when the authentication renews what it acts with. */
  credentials(): string;
};

export type Authentication = {
  /** The URL that signs a person in, then sends them back to `callback` with `state` unchanged. */
  start(callback: string, state: string): string;
  /** Completes the sign-in from the query parameters received at `callback`: the session, or nothing if it failed. */
  finish(query: Readonly<Record<string, string>>): Promise<Session | undefined>;
  /** The session again, from its credentials; nothing when this authentication did not give them. */
  resume(credentials: string): Promise<Session | undefined>;
  /** Stops what the session acts with from working, when the person signs out. */
  revoke(credentials: string): Promise<void>;
};
