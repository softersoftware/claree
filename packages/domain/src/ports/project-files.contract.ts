import { describe, expect, it } from 'vitest';
import { repositoryLink } from '../project';
import type { ProjectFiles } from './project-files';

/** The files of one project, by their path from its root. */
export type Files = Readonly<Record<string, string>>;

/** An adapter of `ProjectFiles`, and what it takes to make a repository where it reads them. */
export type ProjectFilesUnderTest = {
  readonly projectFiles: ProjectFiles;
  /** Makes a repository with these files, and gives its address. */
  repositoryWith(files: Files): Promise<string>;
  /** Replaces the files of the repository at an address. */
  changeRepository(address: string, files: Files): Promise<void>;
  /** An address where there is no repository. */
  readonly nowhere: string;
};

/** What every adapter of `ProjectFiles` must do, the mock as much as the real ones (ADR 0012). */
export const projectFilesContract = (name: string, setUp: () => Promise<ProjectFilesUnderTest>) =>
  describe(`${name}: a project's repository`, () => {
    it('opens a project at its address and reads its files', async () => {
      const { projectFiles, repositoryWith } = await setUp();
      const address = await repositoryWith({ 'README.md': '# Medito', 'docs/glossary.md': '# Glossary' });
      const opened = await projectFiles.open(address);
      expect(opened?.address).toBe(address);
      expect(await opened?.read('README.md')).toBe('# Medito');
      expect(await opened?.read('docs/glossary.md')).toBe('# Glossary');
    });

    it('links to the repository only when a browser can open it', async () => {
      const { projectFiles, repositoryWith } = await setUp();
      const address = await repositoryWith({ 'README.md': '# Medito' });
      expect((await projectFiles.open(address))?.link).toBe(repositoryLink(address));
    });

    it('opens nothing where there is no repository', async () => {
      const { projectFiles, nowhere } = await setUp();
      expect(await projectFiles.open(nowhere)).toBeUndefined();
    });

    it('reads nothing where a project has no such file', async () => {
      const { projectFiles, repositoryWith } = await setUp();
      const opened = await projectFiles.open(await repositoryWith({ 'README.md': '# Medito' }));
      expect(await opened?.read('docs/missing.md')).toBeUndefined();
    });

    it('reads nothing outside the project', async () => {
      const { projectFiles, repositoryWith } = await setUp();
      const opened = await projectFiles.open(await repositoryWith({ 'README.md': '# Medito' }));
      expect(await opened?.read('../README.md')).toBeUndefined();
      expect(await opened?.read('./README.md')).toBeUndefined();
      expect(await opened?.read('/etc/hostname')).toBeUndefined();
    });

    it('reads a repository as it was when it was opened', async () => {
      const { projectFiles, repositoryWith, changeRepository } = await setUp();
      const address = await repositoryWith({ 'README.md': '# Medito' });
      const before = await projectFiles.open(address);
      await changeRepository(address, { 'README.md': '# Changed' });
      const after = await projectFiles.open(address);
      expect(await before?.read('README.md')).toBe('# Medito');
      expect(await after?.read('README.md')).toBe('# Changed');
    });
  });
