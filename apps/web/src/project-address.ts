/** Every project is a GitHub repository (ADR 0014): its page on the platform follows its path there. */
const github = 'https://github.com/';

export const projectParams = (address: string) => {
  const [owner = '', repository = ''] = address.slice(github.length).split('/');
  return { owner, repository };
};
