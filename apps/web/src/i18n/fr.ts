import type { Strings } from './en';

const nbsp = ' ';

export const fr: Strings = {
  description: 'Spécifier et planifier une application, avec les experts métier dans la conversation.',
  signingIn: {
    signIn: 'Se connecter avec GitHub',
    needed: 'Vous devez être connecté pour accéder à vos projets.',
    failed: 'La connexion a échoué. Réessayez.',
    signOut: 'Se déconnecter',
  },
  projects: {
    title: 'Projets',
    count: (count: number) => `Projets — ${count}`,
    notInstalled: (product: string) =>
      `${product} n’est installé sur aucune de vos organisations GitHub. Un propriétaire de l’organisation peut l’installer.`,
    install: (product: string) => `Installer ${product}`,
    noneReadable: (product: string) =>
      `${product} est installé, mais sur aucun dépôt que vous pouvez lire. Demandez l’accès à un propriétaire de l’organisation.`,
    unopened: (address: string) => `«${nbsp}${address}${nbsp}» ne fait pas partie de vos projets.`,
  },
  overview: {
    scope: 'Périmètre',
    repository: 'Dépôt',
  },
  language: 'Langue',
  failed: 'Une erreur s’est produite. Réessayez.',
};
