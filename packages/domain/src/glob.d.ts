/** Reading files as text in tests, as vitest does it. Nothing at runtime uses it. */
interface ImportMeta {
  glob(
    patterns: string | readonly string[],
    options: { readonly query: '?raw'; readonly import: 'default'; readonly eager: true },
  ): Record<string, string>
}
