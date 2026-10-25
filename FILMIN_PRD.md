# Filmin – Talent Meets Cinema
**Product Requirements Document · MVP v1.0**

---

## 1. Executive Summary

Filmin is a web platform that connects film and entertainment professionals with relevant projects and opportunities. It enables professionals to showcase their experience, discover opportunities, and apply, while directors and producers can publish projects and manage applicants.

The MVP demonstrates a complete full-stack workflow using **React, TypeScript, Java/Spring Boot (with Express/Node companion), and PostgreSQL/Relational persistence**.

**Core product loop:** Register → Create profile → Publish opportunity → Discover opportunity → Apply → Review application → Track status.

### Product Assumptions
- Filmin is a portfolio project built by one developer.
- A user can be both a talent seeker and an opportunity creator; separate account types are unnecessary.
- Any authenticated user can publish an opportunity.
- A user cannot apply to their own opportunity.
- An opportunity creator can view and manage applications for their own opportunities only.
- Applicants can view their own applications and statuses, but not other applicants' private information.
- External portfolio URLs are supported initially; file uploads are deferred.
- The application uses a modular monolith, not microservices.
- Public deployment, automated tests, and security verification are required deliverables.

---

## 2. Problem Statement and Target Users

Film professionals often rely on scattered social media posts, informal WhatsApp networks, and word-of-mouth to find projects. Producers and directors struggle to organize submissions, track candidate portfolios, and review applications consistently.

Filmin provides a centralized, structured workflow for professional profiles, opportunity listings, and applications.

### User Personas
1. **Persona A — Talent Seeker (Actors, Editors, Cinematographers, Screenwriters, Crew)**
   - *Goal:* Showcase verified skills, find relevant projects, apply with a customized cover message, and track real-time application status.
2. **Persona B — Project Creator (Directors, Producers, Casting Leads)**
   - *Goal:* Publish casting calls or crew requirements, review applicant portfolios, and shortlist/accept/reject applicants in one organized pipeline.
3. **Persona C — Dual-Role Professional (Independent Filmmakers)**
   - *Goal:* Recruit crew for one project while applying as a cinematographer or editor to another project using the same account.

---

## 3. Goals, Non-Goals, and Success Measures

### Goals
- Deliver a complete, usable end-to-end web application.
- Demonstrate frontend-to-database integration with strict relational constraints.
- Enforce authentication, ownership, and application privacy (IDOR prevention).
- Provide responsive UI usable on mobile and desktop.
- Supply comprehensive documentation and interview-readiness materials.

### Non-Goals (MVP)
- No real-time chat, social feeds, AI recommendations, payment processing, mobile app, video hosting, advanced moderation, or enterprise administration in v1.

### Definition of Success
- Complete the core workflow successfully using two separate accounts.
- All defined ownership and privacy authorization tests pass.
- Application uniqueness constraint prevents race-condition duplicate applications.
- Records remain persistent after server restarts.

---

## 4. Feature Scope and Prioritization

| Feature | Priority | Description |
|---|---|---|
| Registration & Login | MVP (P0) | Session or token-based authentication with bcrypt hashing |
| Logout & Invalidation | MVP (P0) | Invalidate session / token cleanup |
| Professional Profile | MVP (P0) | Bio, primary role, experience years, location, skills, portfolio links |
| Portfolio Links | MVP (P0) | Validated external URLs (IMDb, Vimeo, YouTube, Showreel, Personal) |
| Create / Edit / Close Opportunity | MVP (P0) | Opportunity lifecycle managed by its creator |
| Opportunity Discovery & Filtering | MVP (P0) | Search by keyword, role, location, project type with pagination |
| Apply with Cover Message | MVP (P0) | Submit application once per opportunity with custom message |
| Applicant Dashboard | MVP (P0) | Track applied opportunities and live status changes |
| Review & Status Management | MVP (P0) | Creator updates status: `SUBMITTED` → `SHORTLISTED` → `ACCEPTED` / `REJECTED` |
| Concurrency Protection | MVP (P0) | Relational unique constraint `(opportunity_id, applicant_id)` |
| File Uploads / Social Feed / AI | Later / Out of Scope | Deferred to keep MVP verifiable and clean |

---

## 5. Technical Architecture

### Architecture Overview
- **Frontend:** React, TypeScript, Vite, responsive modern CSS with cinematic styling.
- **Backend:** Modular Monolith architecture:
  - Controllers handle HTTP parsing, DTO binding, and status codes.
  - Services execute business rules, transactions, and permission checks.
  - Repositories handle database persistence via JPA / Relational queries.
- **Database:** PostgreSQL (with Flyway version-controlled migrations) / relational schema.
- **Security:** Bcrypt password hashing, session/token cookies, CSRF protection, strict ownership verification on all state mutations.

### Backend Module Structure
```text
backend/
  src/main/java/com/filmin/
    FilminApplication.java
    config/           # Security, CORS, OpenAPI
    common/           # Global exception handler, API error response, custom exceptions
    auth/             # Controller, Service, Repository, User entity, DTOs
    profile/          # Controller, Service, Repository, Profile entity, DTOs
    opportunity/      # Controller, Service, Repository, Opportunity entity, DTOs
    application/      # Controller, Service, Repository, Application entity, DTOs
  src/main/resources/
    application.yml
    db/migration/
      V1__init_schema.sql
      V2__seed_demo_data.sql
```

---

## 6. Data Model and Schema

### Core Tables
1. **`users`**
   - `id` (BIGINT, PK, Identity)
   - `email` (VARCHAR, Unique, Normalized, Not Null)
   - `password_hash` (VARCHAR, Not Null)
   - `account_status` (VARCHAR, Default 'ACTIVE')
   - `created_at` (TIMESTAMPTZ, Default CURRENT_TIMESTAMP)

2. **`profiles`**
   - `id` (BIGINT, PK, Identity)
   - `user_id` (BIGINT, Unique, FK -> users.id, Not Null)
   - `display_name` (VARCHAR, Not Null)
   - `primary_role` (VARCHAR, Not Null)
   - `skills` (TEXT)
   - `location` (VARCHAR)
   - `bio` (TEXT)
   - `experience_years` (INTEGER, >= 0)
   - `portfolio_links` (JSONB / TEXT)
   - `updated_at` (TIMESTAMPTZ)

3. **`opportunities`**
   - `id` (BIGINT, PK, Identity)
   - `creator_id` (BIGINT, FK -> users.id, Not Null)
   - `title` (VARCHAR, Not Null)
   - `opportunity_type` (VARCHAR, e.g., 'FEATURE_FILM', 'SHORT_FILM', 'WEB_SERIES', 'COMMERCIAL', 'DOCUMENTARY')
   - `role_needed` (VARCHAR, Not Null)
   - `description` (TEXT, Not Null)
   - `location` (VARCHAR, Not Null)
   - `deadline` (DATE, Not Null)
   - `status` (VARCHAR, 'OPEN', 'CLOSED')
   - `created_at` (TIMESTAMPTZ)

4. **`applications`**
   - `id` (BIGINT, PK, Identity)
   - `opportunity_id` (BIGINT, FK -> opportunities.id, Not Null)
   - `applicant_id` (BIGINT, FK -> users.id, Not Null)
   - `cover_message` (TEXT)
   - `status` (VARCHAR, 'SUBMITTED', 'SHORTLISTED', 'ACCEPTED', 'REJECTED')
   - `submitted_at` (TIMESTAMPTZ)
   - `updated_at` (TIMESTAMPTZ)
   - **Constraint:** `UNIQUE (opportunity_id, applicant_id)`

---

## 7. REST API Endpoints

### Auth & Profiles
- `POST /api/auth/register` — Register account (`201 Created`)
- `POST /api/auth/login` — Authenticate and establish session (`200 OK`)
- `POST /api/auth/logout` — Invalidate session (`204 No Content`)
- `GET /api/auth/me` — Return current authenticated user (`200 OK` or `401 Unauthorized`)
- `GET /api/profiles/me` — Get own profile (`200 OK` or `404 Not Found`)
- `PUT /api/profiles/me` — Create or update own profile (`200 OK`)
- `GET /api/profiles/{id}` — Get public profile by user ID (`200 OK` or `404 Not Found`)

### Opportunities
- `GET /api/opportunities` — List open opportunities with search & filters (`keyword`, `role`, `location`, `type`, `page`, `size`)
- `POST /api/opportunities` — Create new opportunity (`201 Created`)
- `GET /api/opportunities/{id}` — View opportunity details (`200 OK` or `404 Not Found`)
- `PUT /api/opportunities/{id}` — Edit own opportunity (`200 OK`, creator only)
- `PATCH /api/opportunities/{id}/status` — Close or reopen opportunity (`200 OK`, creator only)
- `GET /api/opportunities/mine` — List opportunities created by current user (`200 OK`)

### Applications
- `POST /api/opportunities/{id}/applications` — Submit application (`201 Created`, applicant only)
  - Rejected with `400` if deadline expired or opportunity closed.
  - Rejected with `400` if creator tries to apply to own opportunity.
  - Rejected with `409 Conflict` if duplicate application attempted.
- `GET /api/applications/mine` — List current user's submitted applications (`200 OK`)
- `GET /api/opportunities/{id}/applications` — Creator reviews applications for own opportunity (`200 OK`, creator only)
- `PATCH /api/applications/{id}/status` — Creator updates application status (`200 OK`, creator only)

---

## 8. Business Rules & Security Matrix

1. **Duplicate Application Prevention:**
   Enforced at both the service layer and database schema (`UNIQUE (opportunity_id, applicant_id)`).
2. **Authorization & IDOR Protection:**
   Resource ownership verified in every service method before modification or private data access.
3. **No Direct Entity Exposure:**
   All API endpoints accept and return DTOs to prevent mass assignment and sensitive data leakage (e.g. password hashes).
4. **Valid Status Transitions:**
   Application statuses transition from `SUBMITTED` → `SHORTLISTED` → `ACCEPTED` / `REJECTED`.
