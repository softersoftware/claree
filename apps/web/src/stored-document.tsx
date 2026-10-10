import type { WorkshopDocument } from '@claree/domain';
import { served } from '@/projects';
import { MarkdownText } from './markdown';

const pathOf = (location: string): string => location.split(/[?#]/)[0] ?? '';

export const isMarkdown = (location: string): boolean => /\.md$/i.test(pathOf(location));
const isText = (location: string): boolean => /\.txt$/i.test(pathOf(location));

/** Whether a document stored at `location` can be read where it is listed. */
export const isReadable = (location?: string): location is string =>
  location !== undefined && (isMarkdown(location) || isText(location));

/**
 * Reads a document stored among the sketch's own files. Nothing is fetched
 * from an address someone typed: a document stored elsewhere is opened there.
 */
export async function readStored(location: string): Promise<string | undefined> {
  if (!location.startsWith('/')) return undefined;
  const response = await fetch(served(pathOf(location))).catch(() => undefined);
  // A development server answers an unknown address with the application itself.
  if (!response?.ok || response.headers.get('content-type')?.startsWith('text/html')) return undefined;
  return response.text();
}

/**
 * A document that can be read where it is listed: its own text when it was
 * written in the project, Markdown shown as it reads, plain text shown exactly
 * as it was stored. Anything else is left to be opened where it is stored.
 */
export function StoredDocument({ document, source }: { document: WorkshopDocument; source?: string }) {
  const { location, text } = document;
  if (text !== undefined)
    return (
      <div className="mt-3">
        <MarkdownText source={text} location={location} />
      </div>
    );
  if (!isReadable(location) || source === undefined) return null;
  if (isText(location))
    return (
      <pre className="mt-3 max-h-96 overflow-auto rounded-md border border-rule bg-paper px-4 py-3 font-sans text-sm whitespace-pre-wrap">
        {source}
      </pre>
    );
  return (
    <div className="mt-3">
      <MarkdownText source={source} location={location} />
    </div>
  );
}
