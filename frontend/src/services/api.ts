import { User, Profile, Opportunity, Application, PageResponse, ApiError } from '../types';
import { mockStore } from './mockStore';

const API_BASE = '/api';

class ApiClient {
  private currentUserId: number | null = null;
  private isServerUnavailable = false;

  setUserId(id: number | null) {
    this.currentUserId = id;
    if (id) {
      localStorage.setItem('filmin_user_id', id.toString());
    } else {
      localStorage.removeItem('filmin_user_id');
    }
  }

  getUserId(): number | null {
    if (!this.currentUserId) {
      const stored = localStorage.getItem('filmin_user_id');
      if (stored) this.currentUserId = parseInt(stored, 10);
    }
    return this.currentUserId;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (this.isServerUnavailable) {
      throw new Error('FALLBACK_TO_MOCK');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    const userId = this.getUserId();
    if (userId) {
      headers['Authorization'] = `Bearer ${userId}`;
      headers['X-User-Id'] = userId.toString();
    }

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include'
      });

      if (res.status === 204) {
        return {} as T;
      }

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Returned HTML (e.g., SPA fallback on Netlify/Vercel)
        this.isServerUnavailable = true;
        throw new Error('FALLBACK_TO_MOCK');
      }

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const error: ApiError = {
          code: data?.code || `HTTP_${res.status}`,
          message: data?.message || 'An unexpected error occurred.',
          fieldErrors: data?.fieldErrors
        };
        throw error;
      }

      return data as T;
    } catch (err: any) {
      if (err.message === 'FALLBACK_TO_MOCK') {
        throw err;
      }
      if (err.code) throw err;
      this.isServerUnavailable = true;
      throw new Error('FALLBACK_TO_MOCK');
    }
  }

  // Auth
  async register(email: string, password: string): Promise<User> {
    try {
      return await this.request<User>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
    } catch (err: any) {
      if (err.message !== 'FALLBACK_TO_MOCK') throw err;
      // Mock Fallback
      const users = mockStore.getUsers();
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw { code: 'DUPLICATE_EMAIL', message: 'An account with this email address already exists.' } as ApiError;
      }
      const newUser: User = {
        id: users.length + 1,
        email,
        accountStatus: 'ACTIVE',
        createdAt: new Date().toISOString()
      };
      mockStore.saveUser(newUser);
      this.setUserId(newUser.id);
      return newUser;
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const user = await this.request<User>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      this.setUserId(user.id);
      return user;
    } catch (err: any) {
      if (err.message !== 'FALLBACK_TO_MOCK') throw err;
      // Mock Fallback
      const users = mockStore.getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        throw { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' } as ApiError;
      }
      this.setUserId(user.id);
      return user;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.request<void>('/auth/logout', { method: 'POST' });
    } catch {}
    this.setUserId(null);
  }

  async getCurrentUser(): Promise<User | null> {
    const userId = this.getUserId();
    if (!userId) return null;
    try {
      return await this.request<User>('/auth/me');
    } catch (err: any) {
      if (err.message !== 'FALLBACK_TO_MOCK') {
        this.setUserId(null);
        return null;
      }
      const user = mockStore.getUsers().find(u => u.id === userId);
      if (!user) this.setUserId(null);
      return user || null;
    }
  }

  // Profile
  async getMyProfile(): Promise<Profile | null> {
    try {
      return await this.request<Profile>('/profiles/me');
    } catch (err: any) {
      if (err.message !== 'FALLBACK_TO_MOCK') {
        if (err.code === 'NOT_FOUND') return null;
        throw err;
      }
      const userId = this.getUserId();
      if (!userId) return null;
      const profile = mockStore.getProfiles().find(p => p.userId === userId);
      return profile || null;
    }
  }

  async updateMyProfile(profileData: Partial<Profile>): Promise<Profile> {
    try {
      return await this.request<Profile>('/profiles/me', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
    } catch (err: any) {
      if (err.message !== 'FALLBACK_TO_MOCK') throw err;
      const userId = this.getUserId();
      if (!userId) throw { code: 'UNAUTHORIZED', message: 'Not signed in' } as ApiError;
      const profiles = mockStore.getProfiles();
      const existing = profiles.find(p => p.userId === userId);
      const updated: Profile = {
        id: existing?.id || profiles.length + 1,
        userId,
        displayName: profileData.displayName || existing?.displayName || '',
        primaryRole: profileData.primaryRole || existing?.primaryRole || 'Creator',
        skills: profileData.skills || existing?.skills || '',
        location: profileData.location || existing?.location || '',
        bio: profileData.bio || existing?.bio || '',
        experienceYears: profileData.experienceYears ?? existing?.experienceYears ?? 0,
        portfolioLinks: profileData.portfolioLinks || existing?.portfolioLinks || '[]',
        updatedAt: new Date().toISOString()
      };
      mockStore.updateProfile(updated);
      return updated;
    }
  }

  async getPublicProfile(userId: number): Promise<Profile> {
    try {
      return await this.request<Profile>(`/profiles/${userId}`);
    } catch (err: any) {
      if (err.message !== 'FALLBACK_TO_MOCK') throw err;
      const profile = mockStore.getProfiles().find(p => p.userId === userId);
      if (!profile) throw { code: 'NOT_FOUND', message: 'Profile not found' } as ApiError;
      return profile;
    }
  }

  // Opportunities
  async getOpportunities(params: {
    keyword?: string;
    role?: string;
    location?: string;
    type?: string;
    page?: number;
    size?: number;
  } = {}): Promise<PageResponse<Opportunity>> {
    const searchParams = new URLSearchParams();
    if (params.keyword) searchParams.set('keyword', params.keyword);
    if (params.role) searchParams.set('role', params.role);
    if (params.location) searchParams.set('location', params.location);
    if (params.type) searchParams.set('type', params.type);
    if (params.page !== undefined) searchParams.set('page', params.page.toString());
    if (params.size !== undefined) searchParams.set('size', params.size.toString());

    const qs = searchParams.toString();
    try {
      return await this.request<PageResponse<Opportunity>>(`/opportunities${qs ? `?${qs}` : ''}`);
    } catch (err: any) {
      if (err.message !== 'FALLBACK_TO_MOCK') throw err;

      // Mock search & filter
      let opps = mockStore.getOpportunities();
      if (params.keyword) {
        const kw = params.keyword.toLowerCase();
        opps = opps.filter(o => o.title.toLowerCase().includes(kw) || o.description.toLowerCase().includes(kw) || o.roleNeeded.toLowerCase().includes(kw));
      }
      if (params.role) {
        opps = opps.filter(o => o.roleNeeded.toLowerCase() === params.role?.toLowerCase());
      }
      if (params.type) {
        opps = opps.filter(o => o.opportunityType === params.type);
      }
      if (params.location) {
        const loc = params.location.toLowerCase();
        opps = opps.filter(o => o.location.toLowerCase().includes(loc));
      }

      const page = params.page || 0;
      const size = params.size || 9;
      const totalElements = opps.length;
      const totalPages = Math.ceil(totalElements / size) || 1;
      const start = page * size;
      const content = opps.slice(start, start + size);

      return {
        content,
        pageNumber: page,
        pageSize: size,
        totalElements,
        totalPages,
        last: page >= totalPages - 1
      };
    }
  }

  async getOpportunity(id: number): Promise<Opportunity> {
    try {
      return await this.request<Opportunity>(`/opportunities/${id}`);
    } catch (err: any) {
      if (err.message !== 'FALLBACK_TO_MOCK') throw err;
      const opp = mockStore.getOpportunities().find(o => o.id === id);
      if (!opp) throw { code: 'NOT_FOUND', message: 'Opportunity not found' } as ApiError;
      return opp;
    }
  }

  async createOpportunity(data: {
    title: string;
    opportunityType: string;
    roleNeeded: string;
    description: string;
    location: string;
    deadline: string;
  }): Promise<Opportunity> {
    try {
      return await this.request<Opportunity>('/opportunities', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (err: any) {
      if (err.message !== 'FALLBACK_TO_MOCK') throw err;
      const userId = this.getUserId() || 2;
      const userProfile = mockStore.getProfiles().find(p => p.userId === userId);
      const newOpp: Opportunity = {
        id: Date.now(),
        creatorId: userId,
        creatorName: userProfile?.displayName || 'Production Lead',
        title: data.title,
        opportunityType: data.opportunityType,
        roleNeeded: data.roleNeeded,
        description: data.description,
        location: data.location,
        deadline: data.deadline,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        applicantCount: 0
      };
      mockStore.saveOpportunity(newOpp);
      return newOpp;
    }
  }

  async updateOpportunity(id: number, data: Partial<Opportunity>): Promise<Opportunity> {
    try {
      return await this.request<Opportunity>(`/opportunities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch (err: any) {
      if (err.message !== 'FALLBACK_TO_MOCK') throw err;
      const opp = mockStore.getOpportunities().find(o => o.id === id);
      if (!opp) throw { code: 'NOT_FOUND', message: 'Opportunity not found' } as ApiError;
      Object.assign(opp, data);
      mockStore.updateOpportunity(opp);
      return opp;
    }
  }

  async updateOpportunityStatus(id: number, status: 'OPEN' | 'CLOSED'): Promise<Opportunity> {
    try {
      return await this.request<Opportunity>(`/opportunities/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
    } catch (err: any) {
      if (err.message !== 'FALLBACK_TO_MOCK') throw err;
      const opp = mockStore.getOpportunities().find(o => o.id === id);
      if (!opp) throw { code: 'NOT_FOUND', message: 'Opportunity not found' } as ApiError;
      opp.status = status;
      mockStore.updateOpportunity(opp);
      return opp;
    }
  }

  async getMyOpportunities(): Promise<Opportunity[]> {
    try {
      return await this.request<Opportunity[]>('/opportunities/mine');
    } catch (err: any) {
      if (err.message !== 'FALLBACK_TO_MOCK') throw err;
      const userId = this.getUserId() || 2;
      return mockStore.getOpportunities().filter(o => o.creatorId === userId);
    }
  }

  // Applications
  async submitApplication(opportunityId: number, coverMessage: string): Promise<Application> {
    try {
      return await this.request<Application>(`/opportunities/${opportunityId}/applications`, {
        method: 'POST',
        body: JSON.stringify({ coverMessage })
      });
    } catch (err: any) {
      if (err.message !== 'FALLBACK_TO_MOCK') throw err;
      const userId = this.getUserId();
      if (!userId) throw { code: 'UNAUTHORIZED', message: 'Sign in to apply' } as ApiError;

      const opp = mockStore.getOpportunities().find(o => o.id === opportunityId);
      if (!opp) throw { code: 'NOT_FOUND', message: 'Opportunity not found' } as ApiError;
      if (opp.creatorId === userId) {
        throw { code: 'SELF_APPLICATION', message: 'You cannot apply to an opportunity you created.' } as ApiError;
      }

      const existing = mockStore.getApplications().find(a => a.opportunityId === opportunityId && a.applicantId === userId);
      if (existing) {
        throw { code: 'DUPLICATE_APPLICATION', message: 'You have already applied for this opportunity.' } as ApiError;
      }

      const profile = mockStore.getProfiles().find(p => p.userId === userId);
      const newApp: Application = {
        id: Date.now(),
        opportunityId,
        opportunityTitle: opp.title,
        opportunityRole: opp.roleNeeded,
        applicantId: userId,
        applicantName: profile?.displayName || 'Applicant',
        coverMessage,
        status: 'SUBMITTED',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        applicantProfile: profile
      };

      mockStore.saveApplication(newApp);
      return newApp;
    }
  }

  async getMyApplications(): Promise<Application[]> {
    try {
      return await this.request<Application[]>('/applications/mine');
    } catch (err: any) {
      if (err.message !== 'FALLBACK_TO_MOCK') throw err;
      const userId = this.getUserId() || 1;
      return mockStore.getApplications().filter(a => a.applicantId === userId);
    }
  }

  async getApplicationsForOpportunity(opportunityId: number): Promise<Application[]> {
    try {
      return await this.request<Application[]>(`/opportunities/${opportunityId}/applications`);
    } catch (err: any) {
      if (err.message !== 'FALLBACK_TO_MOCK') throw err;
      const userId = this.getUserId();
      const opp = mockStore.getOpportunities().find(o => o.id === opportunityId);
      if (!opp) throw { code: 'NOT_FOUND', message: 'Opportunity not found' } as ApiError;
      if (opp.creatorId !== userId) {
        throw { code: 'FORBIDDEN', message: 'Only the creator can review submissions.' } as ApiError;
      }
      return mockStore.getApplications().filter(a => a.opportunityId === opportunityId);
    }
  }

  async updateApplicationStatus(
    applicationId: number,
    status: 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED'
  ): Promise<Application> {
    try {
      return await this.request<Application>(`/applications/${applicationId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
    } catch (err: any) {
      if (err.message !== 'FALLBACK_TO_MOCK') throw err;
      return mockStore.updateApplicationStatus(applicationId, status);
    }
  }
}

export const api = new ApiClient();
