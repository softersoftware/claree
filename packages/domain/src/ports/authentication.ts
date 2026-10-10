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

export type Authentication = {
  /** The URL that signs a person in, then sends them back to `callback` with `state` unchanged. */
  start(callback: string, state: string): string;
  /** Completes the sign-in from the query parameters received at `callback`: the user, or nothing if it failed. */
  finish(query: Readonly<Record<string, string>>): Promise<User | undefined>;
};
