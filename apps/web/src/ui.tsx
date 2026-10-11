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
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">{title}</h2>
        {aside && <div className="text-xs text-muted">{aside}</div>}
      </div>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

export function Card({ children, tone = 'plain' }: { children: ReactNode; tone?: 'plain' | 'accent' }) {
  return (
    <div className={`rounded-lg border bg-card p-4 ${tone === 'accent' ? 'border-accent' : 'border-rule'}`}>
      {children}
    </div>
  );
}

export function Button({
  children,
  onClick,
  quiet = false,
  disabled = false,
  submit = false,
}: {
  children: ReactNode;
  onClick?(): void;
  quiet?: boolean;
  disabled?: boolean;
  submit?: boolean;
}) {
  return (
    <button
      type={submit ? 'submit' : 'button'}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 ${
        quiet ? 'border border-rule text-ink hover:bg-paper' : 'bg-accent text-white hover:bg-accent-strong'
      }`}
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

/** A sentence about what the domains say of this page, for the people trying the sketch. */
export function Note({ children }: { children: ReactNode }) {
  return <p className="border-l-2 border-rule pl-3 text-sm text-muted">{children}</p>;
}

const field = 'w-full rounded-md border border-rule bg-card px-3 py-1.5 text-sm outline-none focus:border-accent';

export function Input({
  name,
  label,
  defaultValue,
  type = 'text',
  required = true,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  type?: 'text' | 'date';
  required?: boolean;
}) {
  return (
    <input
      type={type}
      name={name}
      aria-label={label}
      placeholder={label}
      defaultValue={defaultValue}
      required={required}
      className={field}
    />
  );
}

export function Textarea({ name, label, defaultValue }: { name: string; label: string; defaultValue?: string }) {
  return (
    <textarea
      name={name}
      aria-label={label}
      placeholder={label}
      defaultValue={defaultValue}
      required
      rows={3}
      className={field}
    />
  );
}

export function Select({
  name,
  label,
  options,
  defaultValue,
  onChange,
  value,
}: {
  name?: string;
  label: string;
  options: readonly (readonly [string, string])[];
  defaultValue?: string;
  value?: string;
  onChange?(value: string): void;
}) {
  return (
    <select
      name={name}
      aria-label={label}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange && ((event) => onChange(event.target.value))}
      className="rounded-md border border-rule bg-card px-2 py-1.5 text-sm"
    >
      {options.map(([option, text]) => (
        <option key={option} value={option}>
          {text}
        </option>
      ))}
    </select>
  );
}

/** A form whose fields are read by name when it is sent, then emptied. */
export function Form({ children, onSubmit }: { children: ReactNode; onSubmit(fields: Record<string, string>): void }) {
  return (
    <form
      className="space-y-2"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const fields = Object.fromEntries([...new FormData(form)].map(([name, value]) => [name, String(value).trim()]));
        onSubmit(fields);
        form.reset();
      }}
    >
      {children}
    </form>
  );
}

/** Something to add, folded until it is asked for. */
export function Adding({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="rounded-lg border border-dashed border-rule p-3">
      <summary className="cursor-pointer text-sm text-accent">{label}</summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

export function External({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="break-all text-accent underline-offset-2 hover:underline"
    >
      {children}
    </a>
  );
}
