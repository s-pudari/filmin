import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import {
  users,
  profiles,
  opportunities,
  applications,
  incrementUserId,
  incrementProfileId,
  incrementOpportunityId,
  incrementApplicationId,
  User,
  Profile,
  Opportunity,
  Application
} from './db.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Session simulation: Read Authorization header (Bearer <userId>) or cookie / fallback
interface AuthenticatedRequest extends Request {
  user?: User;
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  let userId: number | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    userId = parseInt(token, 10);
  } else if (req.headers['x-user-id']) {
    userId = parseInt(req.headers['x-user-id'] as string, 10);
  }

  if (userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
      req.user = user;
    }
  }

  next();
};

app.use(authMiddleware);

// Helper for standard API error
const sendError = (res: Response, status: number, code: string, message: string, fieldErrors?: Record<string, string>) => {
  return res.status(status).json({
    code,
    message,
    ...(fieldErrors ? { fieldErrors } : {})
  });
};

// ==========================================
// AUTH ENDPOINTS
// ==========================================
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'Please correct the highlighted fields.', {
      ...(!email ? { email: 'Email is required.' } : {}),
      ...(!password ? { password: 'Password is required.' } : {})
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    return sendError(res, 409, 'DUPLICATE_RESOURCE', 'An account with this email address already exists.');
  }

  const newUser: User = {
    id: incrementUserId(),
    email: normalizedEmail,
    passwordHash: password,
    accountStatus: 'ACTIVE',
    createdAt: new Date().toISOString()
  };
  users.push(newUser);

  return res.status(201).json({
    id: newUser.id,
    email: newUser.email,
    accountStatus: newUser.accountStatus,
    createdAt: newUser.createdAt
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'Email and password are required.');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find(u => u.email.toLowerCase() === normalizedEmail && u.passwordHash === password);

  if (!user) {
    return sendError(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
  }

  return res.json({
    id: user.id,
    email: user.email,
    accountStatus: user.accountStatus,
    createdAt: user.createdAt
  });
});

app.post('/api/auth/logout', (_req: Request, res: Response) => {
  return res.status(204).send();
});

app.get('/api/auth/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Authentication required.' });
  }

  return res.json({
    id: req.user.id,
    email: req.user.email,
    accountStatus: req.user.accountStatus,
    createdAt: req.user.createdAt
  });
});

// ==========================================
// PROFILE ENDPOINTS
// ==========================================
app.get('/api/profiles/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'UNAUTHORIZED', 'Authentication required.');
  }

  const profile = profiles.find(p => p.userId === req.user!.id);
  if (!profile) {
    return sendError(res, 404, 'NOT_FOUND', 'Profile not found. Please complete your profile.');
  }

  return res.json(profile);
});

app.put('/api/profiles/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'UNAUTHORIZED', 'Authentication required.');
  }

  const { displayName, primaryRole, skills, location, bio, experienceYears, portfolioLinks } = req.body;

  if (!displayName || !primaryRole || experienceYears === undefined || experienceYears === null) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'Display name, primary role, and experience years are required.');
  }

  if (experienceYears < 0) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'Experience years cannot be negative.');
  }

  let profile = profiles.find(p => p.userId === req.user!.id);
  if (!profile) {
    profile = {
      id: incrementProfileId(),
      userId: req.user.id,
      displayName: displayName.trim(),
      primaryRole: primaryRole.trim(),
      skills: skills || '',
      location: location || '',
      bio: bio || '',
      experienceYears: Number(experienceYears),
      portfolioLinks: typeof portfolioLinks === 'string' ? portfolioLinks : JSON.stringify(portfolioLinks || []),
      updatedAt: new Date().toISOString()
    };
    profiles.push(profile);
  } else {
    profile.displayName = displayName.trim();
    profile.primaryRole = primaryRole.trim();
    profile.skills = skills || '';
    profile.location = location || '';
    profile.bio = bio || '';
    profile.experienceYears = Number(experienceYears);
    profile.portfolioLinks = typeof portfolioLinks === 'string' ? portfolioLinks : JSON.stringify(portfolioLinks || []);
    profile.updatedAt = new Date().toISOString();
  }

  return res.json(profile);
});

app.get('/api/profiles/:id', (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  const profile = profiles.find(p => p.userId === userId);

  if (!profile) {
    return sendError(res, 404, 'NOT_FOUND', 'Profile not found.');
  }

  return res.json(profile);
});

// ==========================================
// OPPORTUNITY ENDPOINTS
// ==========================================
app.get('/api/opportunities', (req: Request, res: Response) => {
  const keyword = (req.query.keyword as string || '').toLowerCase().trim();
  const role = (req.query.role as string || '').toLowerCase().trim();
  const location = (req.query.location as string || '').toLowerCase().trim();
  const type = (req.query.type as string || '').trim();
  const page = Math.max(0, parseInt(req.query.page as string || '0', 10));
  const size = Math.min(50, Math.max(1, parseInt(req.query.size as string || '10', 10)));

  let filtered = opportunities.filter(o => o.status === 'OPEN');

  if (keyword) {
    filtered = filtered.filter(o =>
      o.title.toLowerCase().includes(keyword) || o.description.toLowerCase().includes(keyword)
    );
  }
  if (role) {
    filtered = filtered.filter(o => o.roleNeeded.toLowerCase().includes(role));
  }
  if (location) {
    filtered = filtered.filter(o => o.location.toLowerCase().includes(location));
  }
  if (type) {
    filtered = filtered.filter(o => o.opportunityType === type);
  }

  // Sort by createdAt desc
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalElements = filtered.length;
  const totalPages = Math.ceil(totalElements / size);
  const paginated = filtered.slice(page * size, (page + 1) * size);

  const content = paginated.map(o => {
    const creatorProfile = profiles.find(p => p.userId === o.creatorId);
    const applicantCount = applications.filter(a => a.opportunityId === o.id).length;
    return {
      ...o,
      creatorName: creatorProfile ? creatorProfile.displayName : 'Filmmaker',
      applicantCount
    };
  });

  return res.json({
    content,
    pageNumber: page,
    pageSize: size,
    totalElements,
    totalPages,
    last: page >= totalPages - 1
  });
});

app.post('/api/opportunities', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'UNAUTHORIZED', 'Authentication required.');
  }

  const { title, opportunityType, roleNeeded, description, location, deadline } = req.body;

  if (!title || !opportunityType || !roleNeeded || !description || !location || !deadline) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'All opportunity fields are required.');
  }

  const newOpp: Opportunity = {
    id: incrementOpportunityId(),
    creatorId: req.user.id,
    title: title.trim(),
    opportunityType: opportunityType.trim(),
    roleNeeded: roleNeeded.trim(),
    description: description.trim(),
    location: location.trim(),
    deadline,
    status: 'OPEN',
    createdAt: new Date().toISOString()
  };

  opportunities.push(newOpp);
  const creatorProfile = profiles.find(p => p.userId === req.user!.id);

  return res.status(201).json({
    ...newOpp,
    creatorName: creatorProfile?.displayName || req.user.email,
    applicantCount: 0
  });
});

app.get('/api/opportunities/mine', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'UNAUTHORIZED', 'Authentication required.');
  }

  const myOpps = opportunities
    .filter(o => o.creatorId === req.user!.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(o => {
      const applicantCount = applications.filter(a => a.opportunityId === o.id).length;
      return {
        ...o,
        creatorName: 'You',
        applicantCount
      };
    });

  return res.json(myOpps);
});

app.get('/api/opportunities/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const opp = opportunities.find(o => o.id === id);

  if (!opp) {
    return sendError(res, 404, 'NOT_FOUND', `Opportunity not found with ID: ${id}`);
  }

  const creatorProfile = profiles.find(p => p.userId === opp.creatorId);
  const applicantCount = applications.filter(a => a.opportunityId === opp.id).length;

  return res.json({
    ...opp,
    creatorName: creatorProfile?.displayName || 'Filmmaker',
    applicantCount
  });
});

app.put('/api/opportunities/:id', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'UNAUTHORIZED', 'Authentication required.');
  }

  const id = parseInt(req.params.id, 10);
  const opp = opportunities.find(o => o.id === id);

  if (!opp) {
    return sendError(res, 404, 'NOT_FOUND', `Opportunity not found with ID: ${id}`);
  }

  // IDOR check: creator only
  if (opp.creatorId !== req.user.id) {
    return sendError(res, 403, 'FORBIDDEN', 'You can only modify opportunities you created.');
  }

  const { title, opportunityType, roleNeeded, description, location, deadline } = req.body;
  if (title) opp.title = title.trim();
  if (opportunityType) opp.opportunityType = opportunityType.trim();
  if (roleNeeded) opp.roleNeeded = roleNeeded.trim();
  if (description) opp.description = description.trim();
  if (location) opp.location = location.trim();
  if (deadline) opp.deadline = deadline;

  return res.json(opp);
});

app.patch('/api/opportunities/:id/status', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'UNAUTHORIZED', 'Authentication required.');
  }

  const id = parseInt(req.params.id, 10);
  const opp = opportunities.find(o => o.id === id);

  if (!opp) {
    return sendError(res, 404, 'NOT_FOUND', `Opportunity not found with ID: ${id}`);
  }

  // IDOR check: creator only
  if (opp.creatorId !== req.user.id) {
    return sendError(res, 403, 'FORBIDDEN', 'You can only modify the status of opportunities you created.');
  }

  const { status } = req.body;
  if (!['OPEN', 'CLOSED'].includes(status)) {
    return sendError(res, 400, 'BAD_REQUEST', 'Status must be OPEN or CLOSED.');
  }

  opp.status = status;
  return res.json(opp);
});

// ==========================================
// APPLICATION ENDPOINTS
// ==========================================
app.post('/api/opportunities/:id/applications', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'UNAUTHORIZED', 'Authentication required.');
  }

  const oppId = parseInt(req.params.id, 10);
  const opp = opportunities.find(o => o.id === oppId);

  if (!opp) {
    return sendError(res, 404, 'NOT_FOUND', `Opportunity not found with ID: ${oppId}`);
  }

  // Check 1: User completed profile
  const profile = profiles.find(p => p.userId === req.user!.id);
  if (!profile || !profile.displayName || !profile.primaryRole) {
    return sendError(res, 400, 'PROFILE_INCOMPLETE', 'Please complete your profile before applying to opportunities.');
  }

  // Check 2: Opportunity is OPEN
  if (opp.status !== 'OPEN') {
    return sendError(res, 400, 'OPPORTUNITY_CLOSED', 'This opportunity is currently closed for applications.');
  }

  // Check 3: Deadline not passed
  const today = new Date().toISOString().split('T')[0];
  if (opp.deadline < today) {
    return sendError(res, 400, 'DEADLINE_PASSED', 'The deadline for this opportunity has already passed.');
  }

  // Check 4: Self-application prevention
  if (opp.creatorId === req.user.id) {
    return sendError(res, 400, 'SELF_APPLICATION', 'You cannot apply to an opportunity you created.');
  }

  // Check 5: Duplicate application prevention (DB Unique Constraint simulation)
  const existingApp = applications.find(a => a.opportunityId === oppId && a.applicantId === req.user!.id);
  if (existingApp) {
    return sendError(res, 409, 'DUPLICATE_APPLICATION', 'You have already applied to this opportunity.');
  }

  const newApp: Application = {
    id: incrementApplicationId(),
    opportunityId: oppId,
    applicantId: req.user.id,
    coverMessage: req.body.coverMessage || '',
    status: 'SUBMITTED',
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  applications.push(newApp);

  return res.status(201).json({
    id: newApp.id,
    opportunityId: newApp.opportunityId,
    status: newApp.status,
    submittedAt: newApp.submittedAt
  });
});

app.get('/api/applications/mine', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'UNAUTHORIZED', 'Authentication required.');
  }

  const myApps = applications
    .filter(a => a.applicantId === req.user!.id)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .map(a => {
      const opp = opportunities.find(o => o.id === a.opportunityId);
      return {
        ...a,
        opportunityTitle: opp ? opp.title : 'Opportunity',
        opportunityRole: opp ? opp.roleNeeded : ''
      };
    });

  return res.json(myApps);
});

app.get('/api/opportunities/:id/applications', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'UNAUTHORIZED', 'Authentication required.');
  }

  const oppId = parseInt(req.params.id, 10);
  const opp = opportunities.find(o => o.id === oppId);

  if (!opp) {
    return sendError(res, 404, 'NOT_FOUND', `Opportunity not found with ID: ${oppId}`);
  }

  // IDOR Authorization check: creator only
  if (opp.creatorId !== req.user.id) {
    return sendError(res, 403, 'FORBIDDEN', 'Only the opportunity creator can review applicants.');
  }

  const oppApps = applications
    .filter(a => a.opportunityId === oppId)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .map(a => {
      const applicantProfile = profiles.find(p => p.userId === a.applicantId);
      return {
        ...a,
        opportunityTitle: opp.title,
        opportunityRole: opp.roleNeeded,
        applicantName: applicantProfile?.displayName || 'Applicant',
        applicantProfile: applicantProfile || null
      };
    });

  return res.json(oppApps);
});

app.patch('/api/applications/:id/status', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'UNAUTHORIZED', 'Authentication required.');
  }

  const appId = parseInt(req.params.id, 10);
  const appItem = applications.find(a => a.id === appId);

  if (!appItem) {
    return sendError(res, 404, 'NOT_FOUND', `Application not found with ID: ${appId}`);
  }

  const opp = opportunities.find(o => o.id === appItem.opportunityId);
  if (!opp || opp.creatorId !== req.user.id) {
    return sendError(res, 403, 'FORBIDDEN', 'Only the opportunity creator can update application status.');
  }

  const { status } = req.body;
  const currentStatus = appItem.status;

  // Enforce valid status transitions per PRD Section 6
  if (currentStatus === 'ACCEPTED' || currentStatus === 'REJECTED') {
    return sendError(res, 400, 'INVALID_STATUS_TRANSITION', `Terminal status cannot be altered (current: ${currentStatus}).`);
  }

  if (!['SHORTLISTED', 'ACCEPTED', 'REJECTED'].includes(status)) {
    return sendError(res, 400, 'INVALID_STATUS_TRANSITION', `Invalid target status: ${status}`);
  }

  appItem.status = status;
  appItem.updatedAt = new Date().toISOString();

  return res.json(appItem);
});

app.listen(PORT, () => {
  console.log(`🎬 Filmin API Companion Server running on http://localhost:${PORT}`);
});
