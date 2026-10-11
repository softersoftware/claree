import { productName } from '@/product';

/** Direction 003: a dot in the accent, and the name in the serif. */
export function Logo({ large = false }: { large?: boolean }) {
  return (
    <span className={`inline-flex items-center text-ink ${large ? 'gap-3' : 'gap-2'}`}>
      <span aria-hidden className={`rounded-full bg-accent ${large ? 'size-5' : 'size-2.5'}`} />
      <span className={`font-serif font-semibold ${large ? 'text-5xl' : 'text-xl'}`}>{productName}</span>
    </span>
  );
}
