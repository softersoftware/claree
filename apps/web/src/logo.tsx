import { productName } from '@/product';

/** Direction 002: a square in the accent, and the name in capitals, spaced. */
export function Logo({ large = false }: { large?: boolean }) {
  return (
    <span className={`inline-flex items-center text-ink ${large ? 'gap-4' : 'gap-2.5'}`}>
      <span aria-hidden className={`bg-accent ${large ? 'size-9' : 'size-3.5'}`} />
      <span className={`font-sans font-semibold uppercase tracking-[0.18em] ${large ? 'text-4xl' : 'text-sm'}`}>
        {productName}
      </span>
    </span>
  );
}
