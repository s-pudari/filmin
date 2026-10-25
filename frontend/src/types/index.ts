export interface User {
  id: number;
  email: string;
  accountStatus: string;
  createdAt: string;
}

export interface PortfolioLink {
  label: string;
  url: string;
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
  portfolioLinks: string; // JSON string or raw
  updatedAt: string;
}

export interface Opportunity {
  id: number;
  creatorId: number;
  creatorName?: string;
  title: string;
  opportunityType: string;
  roleNeeded: string;
  description: string;
  location: string;
  deadline: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
  applicantCount?: number;
}

export interface Application {
  id: number;
  opportunityId: number;
  opportunityTitle?: string;
  opportunityRole?: string;
  applicantId: number;
  applicantName?: string;
  coverMessage: string;
  status: 'SUBMITTED' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';
  submittedAt: string;
  updatedAt: string;
  applicantProfile?: Profile;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
}
