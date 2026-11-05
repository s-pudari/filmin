import { User, Profile, Opportunity, Application, PageResponse } from '../types';

const STORAGE_KEYS = {
  USERS: 'filmin_store_users',
  PROFILES: 'filmin_store_profiles',
  OPPORTUNITIES: 'filmin_store_opportunities',
  APPLICATIONS: 'filmin_store_applications'
};

const initialUsers: User[] = [
  {
    id: 1,
    email: 'aditi@filmin.demo',
    accountStatus: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    email: 'vikram@filmin.demo',
    accountStatus: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    email: 'karan@filmin.demo',
    accountStatus: 'ACTIVE',
    createdAt: new Date().toISOString()
  }
];

const initialProfiles: Profile[] = [
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

const initialOpportunities: Opportunity[] = [
  {
    id: 1,
    creatorId: 2,
    creatorName: 'Vikram Malhotra',
    title: 'Lead Female Protagonist for Indie Drama "Echoes of Silence"',
    opportunityType: 'FEATURE_FILM',
    roleNeeded: 'Lead Actress',
    description: 'Looking for an expressive female actor aged 24-30 to play the complex role of a wildlife biologist investigating environmental threats in the Western Ghats. Must speak fluent Hindi. 40 days shoot scheduled in December.',
    location: 'Mumbai / Western Ghats',
    deadline: '2026-11-30',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    applicantCount: 0
  },
  {
    id: 2,
    creatorId: 2,
    creatorName: 'Vikram Malhotra',
    title: 'Chief Editor for Psychological Thriller Short "The Red Door"',
    opportunityType: 'SHORT_FILM',
    roleNeeded: 'Video Editor',
    description: 'Seeking a sharp editor with demonstrable experience in non-linear suspense storytelling and rhythm. Proficiency in Premiere Pro / DaVinci Resolve required.',
    location: 'Remote / Hyderabad',
    deadline: '2026-11-15',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    applicantCount: 1
  },
  {
    id: 3,
    creatorId: 3,
    creatorName: 'Karan Sharma',
    title: 'Focus Puller / 1st AC for Neo-Noir Web Series',
    opportunityType: 'WEB_SERIES',
    roleNeeded: 'Camera Assistant',
    description: 'Looking for a disciplined 1st AC familiar with ARRI Alexa Mini LF and Cooke Anamorphic glass for a 6-episode OTT neo-noir crime thriller series.',
    location: 'Bengaluru',
    deadline: '2026-12-05',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    applicantCount: 0
  },
  {
    id: 4,
    creatorId: 2,
    creatorName: 'Vikram Malhotra',
    title: 'Original Background Score Composer for Indie Drama',
    opportunityType: 'FEATURE_FILM',
    roleNeeded: 'Music Composer',
    description: 'Acoustic / ambient score needed for 90-minute indie film. Looking for evocative strings, Indian classical undertones, and subtle electronic motifs.',
    location: 'Remote',
    deadline: '2026-12-20',
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    applicantCount: 0
  }
];

const initialApplications: Application[] = [
  {
    id: 1,
    opportunityId: 2,
    opportunityTitle: 'Chief Editor for Psychological Thriller Short "The Red Door"',
    opportunityRole: 'Video Editor',
    applicantId: 1,
    applicantName: 'Aditi Rao',
    coverMessage: 'Hi Vikram, I edited 3 psychological narrative shorts screened at MAMI. Would love to bring my pacing sense to The Red Door!',
    status: 'SHORTLISTED',
    submittedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export const mockStore = {
  getUsers: (): User[] => getStored<User[]>(STORAGE_KEYS.USERS, initialUsers),
  getProfiles: (): Profile[] => getStored<Profile[]>(STORAGE_KEYS.PROFILES, initialProfiles),
  getOpportunities: (): Opportunity[] => getStored<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, initialOpportunities),
  getApplications: (): Application[] => getStored<Application[]>(STORAGE_KEYS.APPLICATIONS, initialApplications),

  saveUser: (user: User): void => {
    const users = mockStore.getUsers();
    users.push(user);
    setStored(STORAGE_KEYS.USERS, users);
  },

  updateProfile: (profile: Profile): void => {
    const profiles = mockStore.getProfiles();
    const idx = profiles.findIndex(p => p.userId === profile.userId);
    if (idx >= 0) {
      profiles[idx] = profile;
    } else {
      profiles.push(profile);
    }
    setStored(STORAGE_KEYS.PROFILES, profiles);
  },

  saveOpportunity: (opp: Opportunity): void => {
    const opps = mockStore.getOpportunities();
    opps.unshift(opp);
    setStored(STORAGE_KEYS.OPPORTUNITIES, opps);
  },

  updateOpportunity: (opp: Opportunity): void => {
    const opps = mockStore.getOpportunities();
    const idx = opps.findIndex(o => o.id === opp.id);
    if (idx >= 0) {
      opps[idx] = opp;
      setStored(STORAGE_KEYS.OPPORTUNITIES, opps);
    }
  },

  saveApplication: (app: Application): void => {
    const apps = mockStore.getApplications();
    apps.unshift(app);
    setStored(STORAGE_KEYS.APPLICATIONS, apps);

    // Update opportunity applicantCount
    const opps = mockStore.getOpportunities();
    const targetOpp = opps.find(o => o.id === app.opportunityId);
    if (targetOpp) {
      targetOpp.applicantCount = (targetOpp.applicantCount || 0) + 1;
      setStored(STORAGE_KEYS.OPPORTUNITIES, opps);
    }
  },

  updateApplicationStatus: (appId: number, status: 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED'): Application => {
    const apps = mockStore.getApplications();
    const app = apps.find(a => a.id === appId);
    if (!app) throw new Error('Application not found');
    app.status = status;
    app.updatedAt = new Date().toISOString();
    setStored(STORAGE_KEYS.APPLICATIONS, apps);
    return app;
  }
};
