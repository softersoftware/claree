import type { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { External } from '@/ui';

/**
 * A Markdown file of a project, formatted. `linked` turns a link to another file of the project into a link on the
 * platform; any other link opens outside it.
 */
export function Markdown({
  text,
  linked,
}: {
  text: string;
  linked?(href: string, children: ReactNode): ReactNode | undefined;
}) {
  return (
    <div className="space-y-4 font-serif">
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-3xl font-semibold tracking-tight break-words">{children}</h1>,
          h2: ({ children }) => (
            <h3 className="pt-4 font-sans text-xs font-semibold tracking-widest text-muted uppercase">{children}</h3>
          ),
          h3: ({ children }) => <h4 className="pt-2 font-sans font-semibold">{children}</h4>,
          ul: ({ children }) => <ul className="list-disc space-y-1 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-1 pl-5">{children}</ol>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-rule pl-3 text-muted">{children}</blockquote>
          ),
          code: ({ children }) => <code className="font-mono text-sm">{children}</code>,
          a: ({ href = '', children }) => linked?.(href, children) ?? <External href={href}>{children}</External>,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
