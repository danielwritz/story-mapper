## Summary
Set up the Express.js backend API server with TypeScript, better-sqlite3, and testing infrastructure (Vitest + Supertest). This creates the API that will persist story maps, cards, and generated requirements.

## Who This Is For
**Founder perspective**: This is our backend — it stores all the story maps and serves data to the frontend. SQLite means zero config, no external database to manage, and it's portable.
**Agent perspective**: Install and configure Express + TypeScript + better-sqlite3 + Vitest + Supertest in `apps/api`. Ensure `npm run dev` starts the dev server and `npm test` runs Vitest.

## Acceptance Criteria
- [ ] `apps/api` is an Express + TypeScript application
- [ ] better-sqlite3 is installed for database access
- [ ] Vitest + Supertest are configured for API testing
- [ ] `apps/api/src/server.ts` exports the Express app (without listening — for testability)
- [ ] `apps/api/src/index.ts` imports and starts the server on port 3001
- [ ] Health check endpoint: `GET /api/health` returns `{ status: "ok", timestamp: <ISO string> }`
- [ ] CORS is enabled for `http://localhost:5173` (the frontend dev server)
- [ ] JSON body parsing is configured
- [ ] `npm run dev` in `apps/api` starts the server with ts-node or tsx in watch mode
- [ ] `npm test` in `apps/api` runs Vitest and passes
- [ ] `apps/api/data/` directory is gitignored (database file location)
- [ ] Database initialization creates the data directory if it doesn't exist

## Technical Specification

### Dependencies to Install (apps/api)
```
Production: express, cors, better-sqlite3
Dev: @types/express, @types/cors, @types/better-sqlite3, typescript, 
     tsx, vitest, supertest, @types/supertest
```

### `apps/api/src/server.ts`
```ts
// Creates and configures Express app
// - JSON body parser
// - CORS for localhost:5173
// - /api/health route
// - Exports app (does NOT call .listen())
```

### `apps/api/src/index.ts`
```ts
// Imports app from server.ts
// Calls app.listen(3001)
// Logs "API server running on http://localhost:3001"
```

### `apps/api/src/db/index.ts`
```ts
// Initializes better-sqlite3 database
// Creates data/ directory if needed
// Exports a getDb() function that returns the database instance
// Database file path: path.join(__dirname, '../../data/story-mapper.db')
```

### Package Scripts
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

## Test Requirements

### Test: Health check endpoint
```
File: apps/api/src/routes/health.test.ts

Test: "GET /api/health returns 200 with status ok"
- Import app from '../server'
- Use supertest(app).get('/api/health')
- Assert status 200
- Assert body.status === 'ok'
- Assert body.timestamp is a valid ISO date string

Test: "GET /api/health returns JSON content type"
- Assert response Content-Type includes 'application/json'
```

### Test: CORS configuration
```
File: apps/api/src/server.test.ts

Test: "includes CORS headers for localhost:5173"
- Send request with Origin: http://localhost:5173
- Assert response includes Access-Control-Allow-Origin header

Test: "accepts JSON request bodies"
- POST to /api/health (or any route) with JSON body
- Assert express parsed the body (no 415 error)
```

### Test: Database initialization
```
File: apps/api/src/db/index.test.ts

Test: "getDb returns a database instance"
- Call getDb()
- Assert returned object has .prepare method (better-sqlite3 API)

Test: "database file is created in data directory"
- Call getDb()
- Assert the database file exists on disk (use a test-specific path)
```

## Dependencies
- Requires Issue #1 (monorepo setup) to be completed first

## Files to Create/Modify
- `apps/api/package.json` (modify — add dependencies and scripts)
- `apps/api/tsconfig.json` (modify if needed)
- `apps/api/src/index.ts` (create)
- `apps/api/src/server.ts` (create)
- `apps/api/src/db/index.ts` (create)
- `apps/api/src/db/index.test.ts` (create)
- `apps/api/src/routes/health.test.ts` (create)
- `apps/api/src/server.test.ts` (create)
