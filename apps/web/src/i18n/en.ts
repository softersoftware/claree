/** What the platform says, in English. Never what a project says: that is never translated. */
export const en = {
  description: 'Specifying and planning an application, with the domain experts in the conversation.',
  signingIn: {
    signIn: 'Sign in with GitHub',
    needed: 'A project opens only to someone signed in, with the GitHub account it knows them by.',
    failed: 'Nobody was signed in. Try again.',
    signOut: 'Sign out',
  },
  selection: {
    projects: (count: number) => `Projects — ${count}`,
    notLetIn: (product: string) =>
      `${product} is not installed on any GitHub organisation you belong to. An owner of the organisation installs it, on the repositories it chooses.`,
    install: (product: string) => `Install ${product}`,
    noneRecognises: (product: string) =>
      `${product} is installed, but on no repository you can read. Ask an owner of the organisation to give you access to the repository, or to add it to the installation.`,
    unopened: (address: string) => `“${address}” is not one of your projects.`,
  },
  overview: {
    projects: 'Projects',
    scope: 'Scope',
    repository: 'Repository',
  },
}
