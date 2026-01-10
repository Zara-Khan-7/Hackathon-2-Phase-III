<!--
SYNC IMPACT REPORT
==================
Version change: 0.0.0 → 1.0.0 (MAJOR - Initial ratification)
Modified principles: N/A (new constitution)
Added sections:
  - Core Principles (6 principles)
  - Technology Stack Requirements
  - Security Standards
  - Development Workflow
  - Governance
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (Constitution Check section compatible)
  - .specify/templates/spec-template.md ✅ (Requirements format compatible)
  - .specify/templates/tasks-template.md ✅ (Phase structure compatible)
Follow-up TODOs: None
-->

# Todo Full-Stack Web Application Constitution

## Core Principles

### I. Spec-Driven Development

All development MUST follow the Agentic Dev Stack workflow: spec → plan → tasks → implementation.

- Every feature MUST trace back to a written specification requirement
- No feature SHALL be implemented without prior spec approval
- All API behavior MUST be explicitly defined before implementation begins
- Database schema changes MUST be reflected in ORM models and specs
- No manual coding allowed; all code MUST be generated via Claude Code

**Rationale**: Ensures traceability, prevents scope creep, and maintains alignment between requirements and implementation.

### II. Security-First Design

Security MUST be enforced at every layer with strict user isolation.

- JWT authentication MUST be required for all protected API endpoints
- JWT tokens MUST be verified on the backend using a shared secret
- User ID MUST be derived from JWT payload, NEVER trusted from client input
- Each user MUST only access their own tasks (multi-tenant isolation)
- Unauthorized requests MUST return HTTP 401 (Unauthorized)
- Forbidden cross-user access attempts MUST return HTTP 403 (Forbidden)
- Secrets and tokens MUST NEVER be hardcoded; use `.env` files exclusively

**Rationale**: Prevents data leaks, ensures compliance with security best practices, and protects user privacy.

### III. Separation of Concerns

Frontend, backend, and authentication MUST be clearly separated.

- Frontend (Next.js) handles UI rendering, user interactions, and state management
- Backend (FastAPI) handles business logic, data persistence, and API responses
- Authentication (Better Auth) handles session management and JWT issuance
- Frontend and backend MUST communicate only through defined REST APIs
- No business logic SHALL exist in the frontend; UI logic only

**Rationale**: Enables independent development, testing, and deployment of each layer; improves maintainability.

### IV. API-First Design

All data exchange MUST follow RESTful API conventions with explicit contracts.

- RESTful endpoints MUST follow standard HTTP method semantics (GET, POST, PUT, DELETE)
- Request/response schemas MUST be defined using Pydantic models
- All database queries MUST filter by authenticated user ID
- Task ownership MUST be enforced at both ORM and API layer
- Error responses MUST use consistent status codes and message formats
- API versioning strategy MUST be documented before breaking changes

**Rationale**: Ensures predictable API behavior, enables contract testing, and facilitates frontend-backend integration.

### V. Quality and Type Safety

Code MUST be clean, readable, modular, and strongly typed.

- TypeScript MUST be used for all frontend code (Next.js)
- Python type hints MUST be used for all backend code (FastAPI/SQLModel)
- Reusable components MUST be extracted for common UI patterns
- UI MUST be responsive and accessible (WCAG 2.1 AA minimum)
- Code MUST follow established linting and formatting standards

**Rationale**: Strong typing catches errors at compile time; clean code reduces maintenance burden and onboarding time.

### VI. Technology Stack Compliance

All implementation MUST use the approved technology stack without deviation.

| Layer          | Required Technology           |
|----------------|-------------------------------|
| Frontend       | Next.js 16+ (App Router)      |
| Backend        | Python FastAPI                |
| ORM            | SQLModel                      |
| Database       | Neon Serverless PostgreSQL    |
| Authentication | Better Auth (JWT-based)       |
| Spec-Driven    | Claude Code + Spec-Kit Plus   |

- No alternative frameworks or libraries SHALL be substituted without ADR approval
- All dependencies MUST be explicitly declared in package.json / requirements.txt
- Version constraints MUST be specified for all dependencies

**Rationale**: Ensures consistency across the codebase; prevents technology fragmentation; simplifies deployment and maintenance.

## Technology Stack Requirements

### Frontend (Next.js 16+ App Router)

- Use App Router directory structure (`app/`)
- Implement proper client/server component separation (`'use client'` directives)
- Store auth configuration in `lib/` directory
- Use Server Actions for data mutations where appropriate
- Implement loading and error states for all async operations

### Backend (Python FastAPI + SQLModel)

- Entry point at `app/main.py`
- Models in `app/models/` using SQLModel
- Route handlers in `app/routers/`
- Pydantic schemas in `app/schemas/`
- JWT verification middleware in `app/auth/`
- Database connection in `app/database.py`
- Environment variables in `.env` (never committed)

### Database (Neon Serverless PostgreSQL)

- Use connection pooling for serverless environment
- All migrations MUST be versioned and reversible
- Indexes MUST be created for frequently queried columns
- Foreign key constraints MUST be enforced at database level

### Authentication (Better Auth + JWT)

- Better Auth configured on frontend for session management
- JWT tokens issued on successful authentication
- Shared secret between Better Auth and FastAPI backend
- Token expiration and refresh strategy MUST be defined

## Security Standards

### Authentication Flow

1. User authenticates via Better Auth on frontend
2. Better Auth creates session and issues JWT token
3. Frontend includes JWT in `Authorization: Bearer <token>` header
4. Backend extracts and verifies token using shared secret
5. Backend decodes token to extract user ID
6. Backend filters all data queries by authenticated user ID

### Security Checklist (Constitution Check)

- [ ] All API endpoints require JWT authentication (except public routes)
- [ ] User ID extracted from JWT, not from request body/params
- [ ] All database queries filter by authenticated user
- [ ] CORS configured to allow only frontend origin
- [ ] Input validation on all API endpoints
- [ ] No secrets in source code or logs
- [ ] Error messages do not leak sensitive information

## Development Workflow

### Agentic Dev Stack Process

1. **Specify** (`/sp.specify`): Define feature requirements in spec.md
2. **Plan** (`/sp.plan`): Create architectural design in plan.md
3. **Tasks** (`/sp.tasks`): Break down into actionable tasks in tasks.md
4. **Implement** (`/sp.implement`): Execute tasks via Claude Code

### Agent Dispatch Rules

| Task Domain | Specialized Agent | Example Tasks |
|-------------|-------------------|---------------|
| Authentication | `auth-security-specialist` | Better Auth setup, JWT validation, login/signup |
| API/Backend | `neon-postgres-manager` | FastAPI routes, SQLModel ORM, middleware |
| Frontend UI | `nextjs-ui-builder` | Pages, components, forms, layouts |
| Database Design | `best-practices-advisor` | Schema design, indexes, migrations |
| DB Connections | `neon-postgres-manager` | Neon setup, connection pooling |

### Mandatory Checkpoints

- **Pre-Implementation**: Spec approved, plan reviewed, tasks generated
- **Post-Authentication**: JWT flow working end-to-end
- **Post-API**: All CRUD endpoints functional and tested
- **Post-Frontend**: UI connected to API, auth working
- **Pre-Deployment**: Security checklist passed, all features working

## Governance

### Amendment Process

1. Proposed changes MUST be documented with rationale
2. Changes affecting security principles require explicit approval
3. Technology stack changes require an ADR
4. All amendments MUST include migration plan for existing code

### Versioning Policy

- **MAJOR**: Backward-incompatible changes to principles or required technologies
- **MINOR**: New principles, sections, or expanded guidance
- **PATCH**: Clarifications, typo fixes, non-breaking refinements

### Compliance Review

- All PRs MUST be verified against Constitution Check
- Security standards MUST be validated before deployment
- Spec traceability MUST be maintained throughout development
- Violations MUST be documented and justified in Complexity Tracking

### Guidance Reference

For runtime development guidance, refer to:
- `CLAUDE.md` - Agent-specific instructions and technology mappings
- `specs/<feature>/` - Feature specifications and plans
- `history/adr/` - Architectural Decision Records

**Version**: 1.0.0 | **Ratified**: 2026-01-09 | **Last Amended**: 2026-01-09
