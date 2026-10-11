import type { ReactNode } from 'react';

export function Page({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      {title && <h1 className="font-serif text-3xl font-semibold tracking-tight break-words">{title}</h1>}
      <div className={`space-y-8 ${title ? 'mt-8' : ''}`}>{children}</div>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">{title}</h2>
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
