/** Every project is a GitHub repository (ADR 0014): its page on the platform follows its path there. */
const github = 'https://github.com/'

export const projectPage = (address: string) => `/projects/${address.slice(github.length)}`

export const projectAddress = (owner: string, repository: string) => `${github}${owner}/${repository}`
