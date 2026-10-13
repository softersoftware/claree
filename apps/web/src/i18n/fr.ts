import type { Strings } from './en';

const nbsp = ' ';

export const fr: Strings = {
  description: 'Construire des outils numériques avec celles et ceux qui en ont besoin.',
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
  nav: {
    overview: 'Vue d’ensemble',
    workshops: 'Ateliers',
    domains: 'Domaines',
    prototypes: 'Prototypes',
    features: 'Fonctionnalités',
    milestones: 'Jalons',
    branding: 'Identité',
  },
  workshops: {
    none: 'Aucun atelier pour l’instant.',
    noDocuments: 'Aucun document.',
    kinds: {
      slides: 'Présentation',
      video: 'Vidéo',
      recording: 'Enregistrement',
      notes: 'Notes',
      report: 'Compte rendu',
      transcript: 'Transcription',
      sketch: 'Esquisse',
    },
  },
  domains: {
    none: 'Aucun domaine pour l’instant.',
  },
  prototypes: {
    none: 'Aucun prototype pour l’instant.',
    tryIt: 'L’essayer',
  },
  features: {
    none: 'Aucune fonctionnalité pour l’instant.',
    noStories: 'Aucune story pour l’instant.',
    stories: (count: number) => `Stories — ${count}`,
    more: (count: number) => `${count} de plus`,
  },
  stories: {
    states: { 'to do': 'À faire', 'in progress': 'En cours', done: 'Terminée' },
    released: (version: string) => `Livrée en ${version}`,
    blockedBy: (stories: string) => `Bloquée par ${stories}`,
    sizes: (value: string, effort: string) => `Valeur ${value} · Effort ${effort}`,
    value: 'Valeur métier',
    effort: 'Effort',
    unsized: 'Non renseigné',
    milestone: 'Jalon',
    noMilestone: 'Aucun',
    release: 'Livraison',
    releasedOn: (version: string, date: string) => `${version}, le ${date}`,
    notReleased: 'Pas encore',
    blockedByTitle: 'Bloquée par',
    notBlocked: 'Rien.',
    mockUp: 'Maquette',
    noMockUp: 'Aucune maquette pour l’instant.',
    plan: 'Plan d’implémentation',
    noPlan: 'Aucun plan pour l’instant.',
  },
  milestones: {
    none: 'Aucun jalon pour l’instant.',
    noStories: 'Aucune story pour l’instant.',
    reached: 'Atteint',
    totals: (value: number, effort: number | undefined) =>
      `Valeur ${value} · Effort ${effort ?? 'inconnu, certaines stories n’en ont pas'}`,
    groups: { 'to do': 'À faire', 'in progress': 'En cours', done: 'Terminées', released: 'Livrées' },
  },
  branding: {
    none: 'Aucune identité pour l’instant.',
    logo: 'Logo',
    typography: 'Typographie',
    sample: 'Portez ce vieux whisky au juge blond qui fume.',
    typefaceFor: (use: string) => `Pour${nbsp}: ${use}`,
    colours: 'Couleurs',
    files: 'Autres fichiers',
  },
  language: 'Langue',
  failed: 'Une erreur s’est produite. Réessayez.',
};
