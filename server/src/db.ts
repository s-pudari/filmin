export interface User {
  id: number;
  email: string;
  passwordHash: string;
  accountStatus: string;
  createdAt: string;
}

export interface Profile {
  id: number;
  userId: number;
  displayName: string;
  primaryRole: string;
  skills: string;
  location: string;
  bio: string;
  experienceYears: number;
  portfolioLinks: string; // JSON string of [{label, url}]
  updatedAt: string;
}

export interface Opportunity {
  id: number;
  creatorId: number;
  title: string;
  opportunityType: string;
  roleNeeded: string;
  description: string;
  location: string;
  deadline: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
}

export interface Application {
  id: number;
  opportunityId: number;
  applicantId: number;
  coverMessage: string;
  status: 'SUBMITTED' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';
  submittedAt: string;
  updatedAt: string;
}

// Initial synthetic seed data matching V2__seed_demo_data.sql
export const users: User[] = [
  {
    id: 1,
    email: 'aditi@filmin.demo',
    passwordHash: 'password123', // In demo companion, simple check or bcrypt
    accountStatus: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    email: 'vikram@filmin.demo',
    passwordHash: 'password123',
    accountStatus: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    email: 'karan@filmin.demo',
    passwordHash: 'password123',
    accountStatus: 'ACTIVE',
    createdAt: new Date().toISOString()
  }
];

export const profiles: Profile[] = [
  {
    id: 1,
    userId: 1,
    displayName: 'Aditi Rao',
    primaryRole: 'Lead Actress',
    skills: 'Method Acting, Classical Dance, Voice Modulation, Hindi, Telugu',
    location: 'Mumbai, India',
    bio: 'Graduate of FTII Pune with 4 years stage and short film experience. Passionate about character-driven dramas and intense psychological roles.',
    experienceYears: 4,
    portfolioLinks: JSON.stringify([
      { label: 'IMDb', url: 'https://www.imdb.com/name/nm0000001' },
      { label: 'Showreel', url: 'https://vimeo.com/showreel-aditi' }
    ]),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    userId: 2,
    displayName: 'Vikram Malhotra',
    primaryRole: 'Director & Producer',
    skills: 'Direction, Screenwriting, Film Production, Storyboarding, Budgeting',
    location: 'Hyderabad, India',
    bio: 'National Award-winning indie filmmaker heading CloudNine Cine Productions. Casting for upcoming multi-lingual feature film.',
    experienceYears: 10,
    portfolioLinks: JSON.stringify([
      { label: 'IMDb', url: 'https://www.imdb.com/name/nm0000002' },
      { label: 'Production House', url: 'https://cloudninecine.example.com' }
    ]),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    userId: 3,
    displayName: 'Karan Sharma',
    primaryRole: 'Cinematographer & Drone Op',
    skills: 'ARRI Alexa, RED Monstro, Anamorphic Lenses, Drone Piloting, DaVinci Resolve',
    location: 'Bengaluru, India',
    bio: 'Visual storyteller specializing in low-light dramatic framing and atmospheric lighting setups.',
    experienceYears: 6,
    portfolioLinks: JSON.stringify([
      { label: 'Showreel', url: 'https://vimeo.com/karancine' }
    ]),
    updatedAt: new Date().toISOString()
  }
];

export const opportunities: Opportunity[] = [
  {
    id: 1,
    creatorId: 2,
    title: 'Lead Female Protagonist for Indie Drama "Echoes of Silence"',
    opportunityType: 'FEATURE_FILM',
    roleNeeded: 'Lead Actress',
    description: 'Looking for an expressive female actor aged 24-30 to play the complex role of a wildlife biologist investigating environmental threats in the Western Ghats. Must speak fluent Hindi. 40 days shoot scheduled in December.',
    location: 'Mumbai / Western Ghats',
    deadline: '2026-11-30',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 2,
    creatorId: 2,
    title: 'Chief Editor for Psychological Thriller Short "The Red Door"',
    opportunityType: 'SHORT_FILM',
    roleNeeded: 'Video Editor',
    description: 'Seeking a sharp editor with demonstrable experience in non-linear suspense storytelling and rhythm. Proficiency in Premiere Pro / DaVinci Resolve required.',
    location: 'Remote / Hyderabad',
    deadline: '2026-11-15',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 3,
    creatorId: 3,
    title: 'Focus Puller / 1st AC for Neo-Noir Web Series',
    opportunityType: 'WEB_SERIES',
    roleNeeded: 'Camera Assistant',
    description: 'Looking for a disciplined 1st AC familiar with ARRI Alexa Mini LF and Cooke Anamorphic glass for a 6-episode OTT neo-noir crime thriller series.',
    location: 'Bengaluru',
    deadline: '2026-12-05',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 4,
    creatorId: 2,
    title: 'Original Background Score Composer for Indie Drama',
    opportunityType: 'FEATURE_FILM',
    roleNeeded: 'Music Composer',
    description: 'Acoustic / ambient score needed for 90-minute indie film. Looking for evocative strings, Indian classical undertones, and subtle electronic motifs.',
    location: 'Remote',
    deadline: '2026-12-20',
    status: 'OPEN',
    createdAt: new Date().toISOString()
  }
];

export const applications: Application[] = [
  {
    id: 1,
    opportunityId: 2,
    applicantId: 1,
    coverMessage: 'Hi Vikram, I edited 3 psychological narrative shorts screened at MAMI. Would love to bring my pacing sense to The Red Door!',
    status: 'SHORTLISTED',
    submittedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export let nextUserId = 4;
export let nextProfileId = 4;
export let nextOpportunityId = 5;
export let nextApplicationId = 2;

export function incrementUserId() { return nextUserId++; }
export function incrementProfileId() { return nextProfileId++; }
export function incrementOpportunityId() { return nextOpportunityId++; }
export function incrementApplicationId() { return nextApplicationId++; }
