/**
 * A project's name and scope, in its own words: the title of its README and
 * the first paragraph under it. With no README or no title, it is named by its
 * address; with no paragraph under the title, its scope is empty.
 */
export const nameAndScope = (
  address: string,
  readme: string | undefined,
): { readonly name: string; readonly scope: string } => {
  const lines = (readme ?? '').split(/\r?\n/);
  const titleAt = lines.findIndex((line) => /^#\s+\S/.test(line));
  const title = lines[titleAt];
  if (title === undefined) return { name: address, scope: '' };
  const name = title.replace(/^#\s+/, '').replace(/\s+#*\s*$/, '');
  const paragraph: string[] = [];
  for (const line of lines.slice(titleAt + 1)) {
    if (line.trim() === '' && paragraph.length === 0) continue;
    if (line.trim() === '' || /^#{1,6}\s/.test(line)) break;
    paragraph.push(line.trim());
  }
  return { name, scope: paragraph.join(' ') };
};

/**
 * Where a person looks at a project's repository without the platform: its
 * address, when a browser can open it. Nothing else ever becomes a link.
 */
export const repositoryLink = (address: string): string | undefined =>
  /^https:\/\/[^\s]+$/i.test(address) ? address : undefined;
