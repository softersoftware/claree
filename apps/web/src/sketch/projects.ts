import type { Business } from './business';

const pages = 'https://medito-centre.github.io/medito';

/** A project well into its cycle: one version out, the next being built, the one after being tried. */
const medito: Business = {
  language: 'en',
  participants: [
    { name: 'Claire Dubois', roles: ['project owner', 'domain expert'], crafts: [] },
    { name: 'Hugo Lemaire', roles: ['domain expert'], crafts: [] },
    { name: 'Ana Ruiz', roles: ['maker'], crafts: ['business analyst', 'UX designer', 'coder'] },
    { name: 'Sam Lee', roles: ['maker'], crafts: ['UI designer', 'tester'] },
  ],
  branding: {
    personality: ['calm', 'welcoming', 'exact'],
    name: 'Medito',
    tagline: 'Book a session at the centre.',
    tone: 'Quiet and short. Say what happens, never hurry anyone. No exclamation marks.',
    directions: [
      { number: '001', name: 'Stone', where: `${pages}/branding/001/` },
      { number: '002', name: 'Linen', where: `${pages}/branding/002/` },
    ],
    chosen: '002',
    colours: [
      { name: 'Linen', value: '#f5f1ea', for: 'the background' },
      { name: 'Ink', value: '#2b2a28', for: 'text' },
      { name: 'Sage', value: '#5f7a64', for: 'actions and links' },
      { name: 'Clay', value: '#a4583c', for: 'what needs attention' },
    ],
    typography: 'Source Serif for titles, Source Sans for the rest.',
    agreement: { by: 'Claire Dubois', on: '2026-05-02' },
  },
  workshops: [
    {
      id: 'w1',
      date: '2026-03-04',
      title: 'General presentation',
      documents: [
        { id: 'd1', kind: 'slides', title: 'The centre in ten slides', where: 'docs/workshops/20260304/centre.pdf' },
        { id: 'd2', kind: 'recording', title: 'The whole morning', where: 'docs/workshops/20260304/morning.m4a' },
        {
          id: 'd3',
          kind: 'notes',
          title: 'Notes',
          text: 'Three rooms, twelve teachers, about four hundred members.\nToday: a paper sheet at the desk, and phone calls.\nClaire: "half my morning is moving names from one sheet to another."\nWaiting lists exist, on paper, and are never used.',
        },
        { id: 'd4', kind: 'sketch', title: 'Sketch of the whole scope', where: `${pages}/sketches/001/` },
      ],
    },
    {
      id: 'w2',
      date: '2026-03-18',
      title: 'Bookings and cancellations',
      documents: [
        {
          id: 'd5',
          kind: 'notes',
          title: 'Notes',
          text: 'A booking can be cancelled until two hours before.\nHugo: a late cancellation still counts as attended.\nWhat happens to a waiting list when a session is moved? Nobody knows.',
        },
        { id: 'd6', kind: 'transcript', title: 'Transcript', where: 'docs/workshops/20260318/transcript.md' },
      ],
    },
    {
      id: 'w3',
      date: '2026-04-15',
      title: 'Branding',
      documents: [
        {
          id: 'd7',
          kind: 'notes',
          title: 'Notes',
          text: 'Members are mostly over forty, on their phone, between two things.\nIt must never feel like a gym app.\nThree words: calm, welcoming, exact.',
        },
      ],
    },
    {
      id: 'w4',
      date: '2026-07-20',
      title: 'After the first month',
      documents: [
        {
          id: 'd8',
          kind: 'report',
          title: 'Report',
          text: 'Bookings by phone are down by two thirds.\nMembers ask for cards of ten sessions.\nTeachers want to see who is coming the evening before.',
        },
      ],
    },
  ],
  domains: [
    {
      id: 'sessions',
      name: 'Sessions',
      description:
        'The centre holds sessions of meditation, led by a teacher in one of its rooms. The timetable says which sessions are held, when and where.',
      glossary: [
        { name: 'Session', definition: 'One meditation, at a time, in a room, led by a teacher.' },
        { name: 'Teacher', definition: 'The person who leads a session.' },
        { name: 'Room', definition: 'Where a session is held. Each room has its capacity.' },
        { name: 'Capacity', definition: 'How many people a room holds for a session.' },
        { name: 'Timetable', definition: 'The sessions of the coming weeks.' },
      ],
      rules: [
        {
          id: 'r1',
          text: 'A session is held in one room, and led by one teacher.',
          agreement: { by: 'Hugo Lemaire', on: '2026-03-20' },
        },
        {
          id: 'r2',
          text: 'A teacher leads at most one session at a time.',
          agreement: { by: 'Hugo Lemaire', on: '2026-03-20' },
        },
        { id: 'r3', text: 'A session can be moved to another room as long as nobody booked would lose their place.' },
      ],
      questions: [],
    },
    {
      id: 'bookings',
      name: 'Bookings',
      description:
        'Members book a place in a session, and cancel it when they cannot come. When a session is full, they wait for a place.',
      glossary: [
        { name: 'Member', definition: 'Someone who comes to the centre, and books sessions.' },
        { name: 'Booking', definition: 'A place in a session, held for one member.' },
        { name: 'Cancellation', definition: 'A member giving back their place.' },
        { name: 'Late cancellation', definition: 'A cancellation less than two hours before the session.' },
        {
          name: 'Waiting list',
          definition: 'The members who want a place in a full session, in the order they asked.',
        },
      ],
      rules: [
        {
          id: 'r4',
          text: 'A session never holds more bookings than its room’s capacity.',
          agreement: { by: 'Claire Dubois', on: '2026-03-20' },
        },
        {
          id: 'r5',
          text: 'A member books at most one place in a session.',
          agreement: { by: 'Claire Dubois', on: '2026-03-20' },
        },
        {
          id: 'r6',
          text: 'A late cancellation counts as attended.',
          agreement: { by: 'Hugo Lemaire', on: '2026-03-25' },
        },
        { id: 'r7', text: 'When a place is given back, the first member on the waiting list gets it, and is told.' },
      ],
      questions: [
        { id: 'q1', text: 'What happens to a waiting list when its session is moved?', asked: '2026-03-18' },
        {
          id: 'q2',
          text: 'Can someone book for a friend who is not a member?',
          asked: '2026-03-18',
          answer: 'No. Every booking is for one member.',
        },
      ],
    },
    {
      id: 'memberships',
      name: 'Memberships',
      description: 'A member pays for the sessions they come to, by the month or by a card of ten sessions.',
      glossary: [
        { name: 'Monthly membership', definition: 'As many sessions as a member wants, for one month.' },
        { name: 'Card of ten', definition: 'Ten sessions, to use within six months.' },
      ],
      rules: [
        { id: 'r8', text: 'Each session attended uses one session of a card of ten.' },
        { id: 'r9', text: 'A card of ten unused after six months is lost.' },
      ],
      questions: [
        { id: 'q3', text: 'Can a card of ten be shared between two members of one family?', asked: '2026-07-20' },
      ],
    },
  ],
  prototypes: [
    { version: '1.0', where: `${pages}/prototypes/1.0/`, validation: { by: 'Claire Dubois', on: '2026-04-30' } },
    { version: '1.1', where: `${pages}/prototypes/1.1/`, validation: { by: 'Claire Dubois', on: '2026-08-28' } },
    { version: '1.2', where: `${pages}/prototypes/1.2/` },
  ],
  features: [
    { id: 'timetable', name: 'The timetable' },
    { id: 'booking', name: 'Booking a session' },
    { id: 'waiting', name: 'The waiting list' },
    { id: 'cards', name: 'Cards of ten' },
  ],
  stories: [
    {
      id: 's1',
      number: 1,
      feature: 'timetable',
      person: 'member',
      intention: 'see the sessions of the coming week',
      reason: 'I can choose one that fits my day',
      value: 'L',
      effort: 'S',
      status: 'done',
      blockedBy: [],
      version: '1.0',
      mockUp: `${pages}/stories/1/`,
      plan: 'One page, read from the timetable, grouped by day.',
    },
    {
      id: 's2',
      number: 2,
      feature: 'booking',
      person: 'member',
      intention: 'book a place in a session',
      reason: 'I am sure to have a place when I come',
      value: 'XL',
      effort: 'M',
      status: 'done',
      blockedBy: ['s1'],
      version: '1.0',
      plan: 'A button on each session; refused when the room is full.',
    },
    {
      id: 's3',
      number: 3,
      feature: 'booking',
      person: 'member',
      intention: 'cancel my booking',
      reason: 'someone else can have my place',
      value: 'M',
      effort: 'S',
      status: 'done',
      blockedBy: ['s2'],
      version: '1.0',
    },
    {
      id: 's4',
      number: 4,
      feature: 'timetable',
      person: 'teacher',
      intention: 'see who booked my sessions of tomorrow',
      reason: 'I can prepare for the people coming',
      value: 'M',
      effort: 'XS',
      status: 'done',
      blockedBy: ['s2'],
      version: '1.1',
    },
    {
      id: 's5',
      number: 5,
      feature: 'waiting',
      person: 'member',
      intention: 'wait for a place in a full session',
      reason: 'I can still come if someone cancels',
      value: 'L',
      effort: 'M',
      status: 'in progress',
      blockedBy: ['s3'],
      version: '1.1',
      mockUp: `${pages}/stories/5/`,
      plan: 'The waiting list is kept with the session; a cancellation gives the place to its first member.',
    },
    {
      id: 's6',
      number: 6,
      feature: 'waiting',
      person: 'member',
      intention: 'be told when I get a place',
      reason: 'I do not have to keep checking',
      value: 'M',
      effort: 'S',
      status: 'to do',
      blockedBy: ['s5'],
      version: '1.1',
    },
    {
      id: 's7',
      number: 7,
      feature: 'cards',
      person: 'member',
      intention: 'buy a card of ten sessions',
      reason: 'I do not have to pay at every visit',
      value: 'L',
      effort: 'L',
      status: 'to do',
      blockedBy: [],
      version: '1.2',
    },
    {
      id: 's8',
      number: 8,
      feature: 'cards',
      person: 'member',
      intention: 'see how many sessions are left on my card',
      reason: 'I know when to buy the next one',
      value: 'S',
      effort: 'XS',
      status: 'to do',
      blockedBy: ['s7'],
      version: '1.2',
    },
    {
      id: 's9',
      number: 9,
      feature: 'timetable',
      person: 'member',
      intention: 'see the timetable a month ahead',
      reason: 'I can plan around my holidays',
      value: 'XS',
      status: 'to do',
      blockedBy: [],
    },
  ],
  versions: [
    {
      name: '1.0',
      demonstration: { where: `${pages}/demonstrations/1.0/`, validation: { by: 'Claire Dubois', on: '2026-06-24' } },
      deployed: '2026-07-01',
    },
    { name: '1.1', demonstration: { where: `${pages}/demonstrations/1.1/` } },
    { name: '1.2' },
  ],
  feedback: [
    {
      id: 'f1',
      date: '2026-07-14',
      from: 'Claire Dubois',
      text: 'Members ask to pay by cards of ten, as on paper.',
      workshop: 'w4',
    },
    { id: 'f2', date: '2026-09-02', from: 'Hugo Lemaire', text: 'The timetable is hard to read on a small phone.' },
  ],
};

/** A project just started: one workshop, its sketch, and nothing written yet. */
const allotments: Business = {
  language: 'en',
  participants: [
    { name: 'Marc Petit', roles: ['project owner', 'domain expert'], crafts: [] },
    { name: 'Inès Haddad', roles: ['domain expert'], crafts: [] },
    { name: 'Ana Ruiz', roles: ['maker'], crafts: ['business analyst', 'UX designer'] },
  ],
  branding: { personality: [], directions: [], colours: [] },
  workshops: [
    {
      id: 'w1',
      date: '2026-10-02',
      title: 'General presentation',
      documents: [
        {
          id: 'd1',
          kind: 'notes',
          title: 'Notes',
          text: 'Forty plots, a shed of shared tools, and a WhatsApp group nobody reads.\nInès: "the harvest is the easy part, the watering rota is the hard part."',
        },
        {
          id: 'd2',
          kind: 'sketch',
          title: 'Sketch of the whole scope',
          where: 'https://greenlane-gardens.github.io/allotments/sketches/001/',
        },
      ],
    },
  ],
  domains: [],
  prototypes: [],
  features: [],
  stories: [],
  versions: [],
  feedback: [],
};

const empty: Business = {
  language: 'en',
  participants: [],
  branding: { personality: [], directions: [], colours: [] },
  workshops: [],
  domains: [],
  prototypes: [],
  features: [],
  stories: [],
  versions: [],
  feedback: [],
};

/** What each project holds as the sketch starts, by address. */
export const businessAt = (address: string): Business =>
  structuredClone(
    {
      'https://github.com/medito-centre/medito': medito,
      'https://github.com/greenlane-gardens/allotments': allotments,
    }[address] ?? empty,
  );
