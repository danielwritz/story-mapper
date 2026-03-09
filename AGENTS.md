# AGENTS.md — Instructions for Codex 5.3

## Identity
You are the primary development agent for the **Story Mapper** project. You implement features, fix bugs, and write tests based on GitHub issues assigned to you.

## Workflow

### When picking up an issue:
1. **Pull latest `main`** — Always start from the latest `main` branch.
2. **Read the full issue** — Every issue contains acceptance criteria, technical specs, test requirements, and file paths. Follow them precisely.
3. **Implement the change** — Write clean, typed TypeScript code. Follow the project conventions below.
4. **Write ALL required tests** — Every issue specifies exact test cases. Implement every single one. Tests are non-negotiable.
5. **Run tests locally** — Ensure `npm test` passes with zero failures before pushing.
6. **Push directly to `main`** — No pull requests. Commit with a message referencing the issue: `fix #<issue-number>: <short description>`.
7. **Close the issue** — The commit message `fix #N` auto-closes it.

### If tests fail:
- Fix the code until all tests pass. Never push failing tests.
- If you're stuck, add a comment on the issue explaining the blocker.

## Project Conventions

### Code Style
- TypeScript strict mode everywhere
- No `any` types — use proper interfaces/types from `packages/shared`
- Functional components with hooks (React)
- Named exports only (no default exports)
- File names: `kebab-case.ts` / `kebab-case.tsx`
- Component files: `PascalCase.tsx` (exception)
- Test files: `*.test.ts` / `*.test.tsx` co-located next to source files

### Architecture
- **Monorepo** with `apps/web`, `apps/api`, and `packages/shared`
- **Frontend**: React + TypeScript + React Flow + Zustand + Tailwind CSS
- **Backend**: Express + better-sqlite3
- **Shared**: Types, validation schemas (Zod), and utilities used by both apps
- All API routes go in `apps/api/src/routes/`
- All React components go in `apps/web/src/components/`
- All Zustand stores go in `apps/web/src/stores/`
- All shared types go in `packages/shared/src/types/`

### Testing Requirements
- **Unit tests**: Vitest + React Testing Library for all components and utilities
- **Integration tests**: API route tests with supertest
- **E2E tests**: Playwright for critical user flows
- Minimum: every function, component, and API endpoint must have tests
- Test file naming: `<source-file>.test.ts(x)` next to the source file

### Dependencies
When adding new packages, use `npm install` from the workspace root. The monorepo uses npm workspaces.

### Database
- SQLite via better-sqlite3 for local-first storage
- Migrations in `apps/api/src/db/migrations/`
- Database file: `apps/api/data/story-mapper.db` (gitignored)

### Commit Messages
Format: `fix #<issue>: <imperative short description>`
Example: `fix #3: add canvas component with drag-and-drop nodes`

## Important Rules
1. NEVER skip tests. Every issue has test specifications — implement them ALL.
2. NEVER push code that doesn't compile (`npx tsc --noEmit` must pass).
3. NEVER modify test expectations to make them pass — fix the implementation.
4. ALWAYS reference the issue number in your commit.
5. ALWAYS use the types from `packages/shared` — don't create duplicate types.
6. Keep functions small and focused. One function = one responsibility.
7. Handle errors gracefully — use try/catch for async operations, return proper HTTP status codes.
