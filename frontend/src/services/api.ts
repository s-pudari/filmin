import { User, Profile, Opportunity, Application, PageResponse, ApiError } from '../types';

const API_BASE = '/api';

class ApiClient {
  private currentUserId: number | null = null;

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
      if (err.code) throw err;
      throw {
        code: 'NETWORK_ERROR',
        message: 'Could not connect to the Filmin backend server. Please ensure the backend is running.'
      } as ApiError;
    }
  }

  // Auth
  async register(email: string, password: string): Promise<User> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.request<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setUserId(user.id);
    return user;
  }

  async logout(): Promise<void> {
    await this.request<void>('/auth/logout', { method: 'POST' });
    this.setUserId(null);
  }

  async getCurrentUser(): Promise<User | null> {
    const userId = this.getUserId();
    if (!userId) return null;
    try {
      return await this.request<User>('/auth/me');
    } catch {
      this.setUserId(null);
      return null;
    }
  }

  // Profile
  async getMyProfile(): Promise<Profile | null> {
    try {
      return await this.request<Profile>('/profiles/me');
    } catch (err: any) {
      if (err.code === 'NOT_FOUND') return null;
      throw err;
    }
  }

  async updateMyProfile(profileData: Partial<Profile>): Promise<Profile> {
    return this.request<Profile>('/profiles/me', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async getPublicProfile(userId: number): Promise<Profile> {
    return this.request<Profile>(`/profiles/${userId}`);
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
    return this.request<PageResponse<Opportunity>>(`/opportunities${qs ? `?${qs}` : ''}`);
  }

  async getOpportunity(id: number): Promise<Opportunity> {
    return this.request<Opportunity>(`/opportunities/${id}`);
  }

  async createOpportunity(data: {
    title: string;
    opportunityType: string;
    roleNeeded: string;
    description: string;
    location: string;
    deadline: string;
  }): Promise<Opportunity> {
    return this.request<Opportunity>('/opportunities', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateOpportunity(id: number, data: Partial<Opportunity>): Promise<Opportunity> {
    return this.request<Opportunity>(`/opportunities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async updateOpportunityStatus(id: number, status: 'OPEN' | 'CLOSED'): Promise<Opportunity> {
    return this.request<Opportunity>(`/opportunities/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  async getMyOpportunities(): Promise<Opportunity[]> {
    return this.request<Opportunity[]>('/opportunities/mine');
  }

  // Applications
  async submitApplication(opportunityId: number, coverMessage: string): Promise<Application> {
    return this.request<Application>(`/opportunities/${opportunityId}/applications`, {
      method: 'POST',
      body: JSON.stringify({ coverMessage })
    });
  }

  async getMyApplications(): Promise<Application[]> {
    return this.request<Application[]>('/applications/mine');
  }

  async getApplicationsForOpportunity(opportunityId: number): Promise<Application[]> {
    return this.request<Application[]>(`/opportunities/${opportunityId}/applications`);
  }

  async updateApplicationStatus(
    applicationId: number,
    status: 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED'
  ): Promise<Application> {
    return this.request<Application>(`/applications/${applicationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }
}

export const api = new ApiClient();
