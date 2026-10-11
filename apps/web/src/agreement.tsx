import { useState } from 'react';
import { type Agreement, type Participant, today } from '@/sketch/business';
import { useBusiness } from '@/sketch/store';
import { Button, Select } from '@/ui';

/** Agreement is explicit: someone named agrees to something named, on a date. */
export function AgreeBy({
  label,
  among,
  onAgree,
}: {
  label: string;
  /** Who may give it: the domain experts, or the project owner. */
  among: (participant: Participant) => boolean;
  onAgree(agreement: Agreement): void;
}) {
  const { business } = useBusiness();
  const people = business.participants.filter(among).map((participant) => participant.name);
  const [by, setBy] = useState(people[0] ?? '');
  if (people.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select label={label} value={by} onChange={setBy} options={people.map((name) => [name, name] as const)} />
      <Button quiet onClick={() => onAgree({ by, on: today() })}>
        {label}
      </Button>
    </div>
  );
}

export const isDomainExpert = (participant: Participant) => participant.roles.includes('domain expert');

export const isProjectOwner = (participant: Participant) => participant.roles.includes('project owner');
