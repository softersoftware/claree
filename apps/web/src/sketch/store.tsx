import { createContext, type ReactNode, useContext, useState } from 'react';
import type { Business } from './business';
import { businessAt } from './projects';

/** Each sketch stores under its own path, since sketches share one site. */
const key = (address: string) => `${import.meta.env.BASE_URL}business ${address}`;

export const stored = (address: string): Business => {
  try {
    const saved = localStorage.getItem(key(address));
    if (saved) return JSON.parse(saved) as Business;
  } catch {}
  return businessAt(address);
};

type CurrentBusiness = {
  business: Business;
  /** Changes a copy of the business, and stores it. */
  change(edit: (business: Business) => void): void;
  /** Back to what the sketch started with. */
  restart(): void;
};

const BusinessContext = createContext<CurrentBusiness | undefined>(undefined);

export function BusinessProvider({ address, children }: { address: string; children: ReactNode }) {
  const [business, setBusiness] = useState(() => stored(address));
  const store = (next: Business) => {
    try {
      localStorage.setItem(key(address), JSON.stringify(next));
    } catch {}
    setBusiness(next);
  };
  const change = (edit: (business: Business) => void) => {
    const next = structuredClone(business);
    edit(next);
    store(next);
  };
  const restart = () => {
    try {
      localStorage.removeItem(key(address));
    } catch {}
    setBusiness(businessAt(address));
  };
  return <BusinessContext value={{ business, change, restart }}>{children}</BusinessContext>;
}

export const useBusiness = () => {
  const current = useContext(BusinessContext);
  if (current === undefined) throw new Error('useBusiness is used outside BusinessProvider.');
  return current;
};

export const newId = () => Math.random().toString(36).slice(2, 10);
