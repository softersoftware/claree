import { describe, expect, it } from 'vitest';
import type { Authentication } from './authentication';

/** An adapter of `Authentication`, with one account for each kind of project list. */
export type AuthenticationUnderTest = {
  readonly authentication: Authentication;
  /** The query a person comes back to the callback with, after signing in to this account and agreeing. */
  signedIn(
    account: 'with projects' | 'not installed' | 'none readable',
    state: string,
  ): Promise<Record<string, string>>;
  /** The query a person comes back with after refusing. */
  refused(state: string): Record<string, string>;
};

export const authenticationContract = (name: string, setUp: () => Promise<AuthenticationUnderTest>) =>
  describe(`${name}: signing in`, () => {
    it('sends a person to an address where they sign in', async () => {
      const { authentication } = await setUp();
      expect(() => new URL(authentication.start('http://platform/sign-in/callback', 's1'))).not.toThrow();
    });

    it('signs in to an account with projects, and opens them', async () => {
      const { authentication, signedIn } = await setUp();
      const user = await authentication.finish(await signedIn('with projects', 's1'));
      expect(user?.name).not.toBe('');
      const projects = await user?.projects();
      expect(projects?.found).toBe('some');
      if (projects?.found !== 'some') return;
      expect(projects.addresses.length).toBeGreaterThan(0);
      for (const address of projects.addresses) expect(await user?.projectFiles.open(address)).toBeDefined();
    });

    it('says when the platform is installed on none of the organisations of the account', async () => {
      const { authentication, signedIn } = await setUp();
      const user = await authentication.finish(await signedIn('not installed', 's1'));
      expect((await user?.projects())?.found).toBe('not installed');
    });

    it('says when the account can read no repository where the platform is installed', async () => {
      const { authentication, signedIn } = await setUp();
      const user = await authentication.finish(await signedIn('none readable', 's1'));
      expect((await user?.projects())?.found).toBe('none readable');
    });

    it('opens no project of another account', async () => {
      const { authentication, signedIn } = await setUp();
      const owner = await authentication.finish(await signedIn('with projects', 's1'));
      const projects = await owner?.projects();
      const other = await authentication.finish(await signedIn('none readable', 's2'));
      if (projects?.found !== 'some') throw new Error('the account with projects has none');
      for (const address of projects.addresses) expect(await other?.projectFiles.open(address)).toBeUndefined();
    });

    it('signs nobody in when the person refuses, or comes back with nothing', async () => {
      const { authentication, refused } = await setUp();
      expect(await authentication.finish(refused('s1'))).toBeUndefined();
      expect(await authentication.finish({})).toBeUndefined();
    });
  });
