import type { Account } from '../arrival';

/**
 * Who has arrived. Everything this holds can be thrown away without any
 * project losing anything.
 */
export type Arrivals = {
  whoIsHere(): Promise<Account | undefined>;
  arrive(account: Account): Promise<void>;
  leave(): Promise<void>;
  /** The projects this person added, for them alone. */
  addedProjects(): Promise<readonly string[]>;
  addProject(projectId: string): Promise<void>;
  removeProject(projectId: string): Promise<void>;
};
