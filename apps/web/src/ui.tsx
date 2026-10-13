import type { ReactNode } from 'react';

export function Page({ title, back, children }: { title?: string; back?: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      {back && <div className="mb-2 text-sm text-muted">{back}</div>}
      {title && <h1 className="font-serif text-3xl font-semibold tracking-tight break-words">{title}</h1>}
      <div className={`space-y-8 ${title ? 'mt-8' : ''}`}>{children}</div>
    </div>
  );
}

export function Section({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">{title}</h2>
        {aside && <div className="text-xs text-muted">{aside}</div>}
      </div>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border border-rule bg-card p-4">{children}</div>;
}

export function Button({ children, onClick }: { children: ReactNode; onClick(): void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-strong"
    >
      {children}
    </button>
  );
}

export function Pill({ children, tone = 'plain' }: { children: ReactNode; tone?: 'plain' | 'accent' | 'warn' }) {
  const tones = {
    plain: 'border-rule text-muted',
    accent: 'border-accent text-accent',
    warn: 'border-warn text-warn',
  };
  return (
    <span
      className={`inline-block rounded-md border px-1.5 py-px text-xs font-medium whitespace-nowrap ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted">{children}</p>;
}

/** A link that opens outside the platform, in a new tab. */
export function External({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="break-words text-accent underline-offset-2 hover:underline"
    >
      {children}
    </a>
  );
}
