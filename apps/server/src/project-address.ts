/** Every project is a GitHub repository (ADR 0014): its page on the platform follows its path there. */
export const projectAddress = (owner: string, repository: string) => `https://github.com/${owner}/${repository}`
