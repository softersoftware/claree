/** What the platform says, in English. Never what a project says: that is never translated. */
export const en = {
  description: 'Specifying and planning an application, with the domain experts in the conversation.',
  signingIn: {
    signIn: 'Sign in with GitHub',
    needed: 'You need to be signed in to access your projects.',
    failed: 'Signing in failed. Try again.',
    signOut: 'Sign out',
  },
  projects: {
    title: 'Projects',
    count: (count: number) => `Projects — ${count}`,
    notInstalled: (product: string) =>
      `${product} is not installed on any of your GitHub organisations. An owner of the organisation can install it.`,
    install: (product: string) => `Install ${product}`,
    noneReadable: (product: string) =>
      `${product} is installed, but on no repository you can read. Ask an owner of the organisation for access.`,
    unopened: (address: string) => `“${address}” is not one of your projects.`,
  },
  overview: {
    scope: 'Scope',
    repository: 'Repository',
  },
  language: 'Language',
  failed: 'Something went wrong. Try again.',
};

export type Strings = typeof en;
