import { productName } from '@/product';

/** Direction 001: the name alone, set in the serif. */
export function Logo({ large = false }: { large?: boolean }) {
  return (
    <span className={`font-serif font-semibold tracking-tight text-ink ${large ? 'text-5xl' : 'text-xl'}`}>
      {productName}
    </span>
  );
}
