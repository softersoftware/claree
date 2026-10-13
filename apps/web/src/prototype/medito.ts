import type { Project } from './project';

const repository = 'https://github.com/medito-centre/medito';
const pages = 'https://medito-centre.github.io/medito';
const file = (path: string) => `${repository}/blob/main/${path.split('/').map(encodeURIComponent).join('/')}`;

const logo = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 40"><circle cx="20" cy="20" r="14" fill="none" stroke="#5f7a64" stroke-width="3"/><circle cx="20" cy="20" r="4" fill="#5f7a64"/><text x="44" y="27" font-family="Georgia, serif" font-size="20" fill="#2b2a28">Medito</text></svg>',
)}`;

/** A project well into its cycle: one milestone reached, the next released in part, the one after to do. */
export const medito: Project = {
  workshops: [
    {
      date: '2026-03-04',
      title: 'General presentation',
      documents: [
        {
          kind: 'slides',
          title: 'The centre in ten slides',
          link: file('docs/workshops/20260304 general presentation/centre.pdf'),
        },
        {
          kind: 'recording',
          title: 'The whole morning',
          link: file('docs/workshops/20260304 general presentation/morning.m4a'),
        },
        { kind: 'notes', title: 'Notes', link: file('docs/workshops/20260304 general presentation/notes.md') },
        { kind: 'sketch', title: 'Sketch of the whole scope', link: `${pages}/sketches/001/` },
      ],
    },
    {
      date: '2026-03-18',
      title: 'Bookings and cancellations',
      documents: [
        { kind: 'notes', title: 'Notes', link: file('docs/workshops/20260318 bookings and cancellations/notes.md') },
        {
          kind: 'transcript',
          title: 'Transcript',
          link: file('docs/workshops/20260318 bookings and cancellations/transcript.md'),
        },
      ],
    },
    {
      date: '2026-04-15',
      title: 'Branding',
      documents: [{ kind: 'notes', title: 'Notes', link: file('docs/workshops/20260415 branding/notes.md') }],
    },
    {
      date: '2026-07-20',
      title: 'After the first month',
      documents: [
        { kind: 'report', title: 'Report', link: file('docs/workshops/20260720 after the first month/report.md') },
        {
          kind: 'video',
          title: 'Members at the desk',
          link: file('docs/workshops/20260720 after the first month/desk.mp4'),
        },
      ],
    },
  ],

  domains: [
    {
      file: 'sessions.md',
      text: `# Sessions

The centre holds sessions of meditation, led by a teacher in one of its rooms. The timetable says which sessions are held, when and where.

## Glossary

- **Session**: one meditation, at a time, in a room, led by a teacher.
- **Teacher**: the person who leads a session.
- **Room**: where a session is held. Each room has its capacity.
- **Capacity**: how many people a room holds for a session.
- **Timetable**: the sessions of the coming weeks.

## Rules

**Rule.** A session is held in one room, and led by one teacher.

**Rule.** A teacher leads at most one session at a time.

**Rule.** A session can be moved to another room as long as nobody [booked](bookings.md) would lose their place.
`,
    },
    {
      file: 'bookings.md',
      text: `# Bookings

Members book a place in a [session](sessions.md), and cancel it when they cannot come. When a session is full, they wait for a place.

## Glossary

- **Member**: someone who comes to the centre, and books sessions.
- **Booking**: a place in a session, held for one member.
- **Cancellation**: a member giving back their place.
- **Late cancellation**: a cancellation less than two hours before the session.
- **Waiting list**: the members who want a place in a full session, in the order they asked.

## Rules

**Rule.** A session never holds more bookings than its room's capacity.

**Rule.** A member books at most one place in a session.

**Rule.** A late cancellation counts as attended.

**Rule.** When a place is given back, the first member on the waiting list gets it, and is told.

## Questions

- What happens to a waiting list when its session is moved?
`,
    },
    {
      file: 'memberships.md',
      text: `# Memberships

A member pays for the sessions they come to, by the month or by a card of ten sessions.

## Glossary

- **Monthly membership**: as many sessions as a member wants, for one month.
- **Card of ten**: ten sessions, to use within six months.

## Rules

**Rule.** Each session attended uses one session of a card of ten.

**Rule.** A card of ten unused after six months is lost.

## Questions

- Can a card of ten be shared between two members of one family?
`,
    },
  ],

  prototypes: [
    { milestone: 'Booking', link: `${pages}/prototypes/booking/` },
    { milestone: 'Waiting list', link: `${pages}/prototypes/waiting-list/` },
    { milestone: 'Cards of ten', link: `${pages}/prototypes/cards-of-ten/` },
  ],

  features: [
    { number: 1, name: 'The timetable', description: 'The sessions of the coming weeks, and who comes to them.' },
    { number: 2, name: 'Booking a session', description: 'A member takes a place in a session, or gives it back.' },
    { number: 3, name: 'The waiting list', description: 'When a session is full, members wait for a place.' },
    { number: 4, name: 'Cards of ten', description: 'Paying for ten sessions at once.' },
  ],

  stories: [
    {
      number: 5,
      title: 'See the sessions of the coming week',
      feature: 1,
      person: 'member',
      intention: 'see the sessions of the coming week',
      reason: 'I can choose one that fits my day',
      value: 'L',
      effort: 'S',
      state: 'done',
      blockedBy: [],
      mockUp: `${pages}/stories/5/`,
      plan: 'One page, read from the timetable, grouped by day.',
      release: '1.0',
    },
    {
      number: 6,
      title: 'Book a place in a session',
      feature: 2,
      person: 'member',
      intention: 'book a place in a session',
      reason: 'I am sure to have a place when I come',
      value: 'XL',
      effort: 'M',
      state: 'done',
      blockedBy: [5],
      plan: 'A button on each session; refused when the room is full.',
      release: '1.0',
    },
    {
      number: 7,
      title: 'Cancel a booking',
      feature: 2,
      person: 'member',
      intention: 'cancel my booking',
      reason: 'someone else can have my place',
      value: 'M',
      effort: 'S',
      state: 'done',
      blockedBy: [6],
      release: '1.0',
    },
    {
      number: 8,
      title: 'See who booked tomorrow',
      feature: 1,
      person: 'teacher',
      intention: 'see who booked my sessions of tomorrow',
      reason: 'I can prepare for the people coming',
      value: 'M',
      effort: 'XS',
      state: 'done',
      blockedBy: [6],
      release: '1.1',
    },
    {
      number: 9,
      title: 'Wait for a place in a full session',
      feature: 3,
      person: 'member',
      intention: 'wait for a place in a full session',
      reason: 'I can still come if someone cancels',
      value: 'L',
      effort: 'M',
      state: 'done',
      blockedBy: [7],
      mockUp: `${pages}/stories/9/`,
      plan: 'The waiting list is held with the session; a cancellation gives the place to its first member.',
      release: '1.2',
    },
    {
      number: 10,
      title: 'Be told when a place is free',
      feature: 3,
      person: 'member',
      intention: 'be told when I get a place',
      reason: 'I do not have to keep checking',
      value: 'M',
      effort: 'S',
      state: 'done',
      blockedBy: [9],
      mockUp: `${pages}/stories/10/`,
    },
    {
      number: 11,
      title: 'Leave a waiting list',
      feature: 3,
      person: 'member',
      intention: 'leave a waiting list',
      reason: 'the next member gets the place instead of me',
      value: 'S',
      effort: 'XS',
      state: 'in progress',
      blockedBy: [9],
      mockUp: `${pages}/stories/11/`,
      plan: 'A button beside the place on the waiting list.',
    },
    {
      number: 12,
      title: 'See the waiting list at the desk',
      feature: 3,
      person: 'person at the desk',
      intention: 'see the waiting list of a session',
      reason: 'I can answer a member who calls',
      value: 'S',
      state: 'to do',
      blockedBy: [11],
    },
    {
      number: 13,
      title: 'Buy a card of ten',
      feature: 4,
      person: 'member',
      intention: 'buy a card of ten sessions',
      reason: 'I do not have to pay at every visit',
      value: 'L',
      effort: 'L',
      state: 'to do',
      blockedBy: [],
    },
    {
      number: 14,
      title: 'See the sessions left on a card',
      feature: 4,
      person: 'member',
      intention: 'see how many sessions are left on my card',
      reason: 'I know when to buy the next one',
      value: 'S',
      effort: 'XS',
      state: 'to do',
      blockedBy: [13],
    },
    {
      number: 15,
      title: 'See the timetable a month ahead',
      feature: 1,
      person: 'member',
      intention: 'see the timetable a month ahead',
      reason: 'I can plan around my holidays',
      value: 'XS',
      state: 'to do',
      blockedBy: [],
    },
  ],

  milestones: [
    { name: 'Booking', description: 'Members book and cancel on their phone, not at the desk.', stories: [5, 6, 7, 8] },
    {
      name: 'Waiting list',
      description: 'A place given back goes to the next member waiting.',
      stories: [9, 10, 11, 12],
    },
    { name: 'Cards of ten', description: 'Members pay for ten sessions at once.', stories: [13, 14] },
  ],

  releases: [
    { version: '1.0', date: '2026-07-01' },
    { version: '1.1', date: '2026-08-12' },
    { version: '1.2', date: '2026-10-06' },
  ],

  branding: {
    files: [
      {
        file: 'README.md',
        text: `# Medito

*Book a session at the centre.*

Calm, welcoming, exact. Members are mostly over forty, on their phone, between two things. Medito must never feel like a gym app.
`,
      },
      {
        file: 'tone.md',
        text: `# Tone

Quiet and short. Say what happens, never hurry anyone.

- No exclamation marks.
- Say *session*, never *class*.
- A place is *given back*, not *cancelled*, when a member speaks of their own.
`,
      },
    ],
    logo,
    colours: [
      { name: 'Linen', value: '#f5f1ea', for: 'the background' },
      { name: 'Ink', value: '#2b2a28', for: 'text' },
      { name: 'Sage', value: '#5f7a64', for: 'actions and links' },
      { name: 'Clay', value: '#a4583c', for: 'what needs attention' },
    ],
    typefaces: [
      { name: 'Georgia', for: 'titles' },
      { name: 'Verdana', for: 'everything else' },
    ],
    others: [
      { file: 'logo.svg', link: file('docs/branding/logo.svg') },
      { file: 'icon.svg', link: file('docs/branding/icon.svg') },
      { file: 'theme.css', link: file('docs/branding/theme.css') },
    ],
  },
};
