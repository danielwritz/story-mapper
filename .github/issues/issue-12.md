## Summary
Implement the SQLite database schema and migration system for persisting story maps. This creates all the tables needed to store the full story map data model: maps, epics, activities, stories, releases, and requirements.

## Who This Is For
**Founder perspective**: Without persistence, everything vanishes when you close the browser. This creates the database tables that store all your story maps permanently on the server.
**Agent perspective**: Create a migration system in `apps/api/src/db/migrations/` that initializes the SQLite database with tables for all domain entities. Use better-sqlite3's synchronous API. Migrations should be versioned and run automatically on server startup.

## Acceptance Criteria
- [ ] Migration runner executes numbered SQL migration files in order
- [ ] Migration state is tracked in a `_migrations` table (which migrations have run)
- [ ] Migrations run automatically when `getDb()` is called for the first time
- [ ] All domain entity tables are created via migration `001_initial_schema.sql`
- [ ] Tables have proper foreign key constraints with ON DELETE CASCADE where appropriate
- [ ] All `id` columns are TEXT (UUID) primary keys
- [ ] `createdAt` and `updatedAt` columns are TEXT (ISO 8601) with DEFAULT CURRENT_TIMESTAMP
- [ ] Indexes exist on all foreign key columns for query performance
- [ ] The database is created in `apps/api/data/story-mapper.db`
- [ ] WAL mode is enabled for better concurrent read performance

## Technical Specification

### Migration Runner
```ts
// apps/api/src/db/migrate.ts

function runMigrations(db: Database): void {
  // 1. Create _migrations table if not exists
  // 2. Read all .sql files from migrations/ directory
  // 3. Sort by filename (001_, 002_, ...)
  // 4. For each migration not yet recorded in _migrations:
  //    a. Execute the SQL
  //    b. Record it in _migrations with a timestamp
}
```

### Migration: 001_initial_schema.sql
```sql
-- Story Maps
CREATE TABLE IF NOT EXISTS story_maps (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Epics
CREATE TABLE IF NOT EXISTS epics (
  id TEXT PRIMARY KEY,
  story_map_id TEXT NOT NULL REFERENCES story_maps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#6366f1',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_epics_story_map_id ON epics(story_map_id);

-- Activities
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  epic_id TEXT NOT NULL REFERENCES epics(id) ON DELETE CASCADE,
  story_map_id TEXT NOT NULL REFERENCES story_maps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_activities_epic_id ON activities(epic_id);
CREATE INDEX IF NOT EXISTS idx_activities_story_map_id ON activities(story_map_id);

-- Stories
CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  activity_id TEXT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  story_map_id TEXT NOT NULL REFERENCES story_maps(id) ON DELETE CASCADE,
  release_id TEXT REFERENCES releases(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  acceptance_criteria TEXT NOT NULL DEFAULT '',
  priority TEXT NOT NULL DEFAULT 'could' CHECK(priority IN ('must','should','could','wont')),
  story_points INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_stories_activity_id ON stories(activity_id);
CREATE INDEX IF NOT EXISTS idx_stories_story_map_id ON stories(story_map_id);
CREATE INDEX IF NOT EXISTS idx_stories_release_id ON stories(release_id);

-- Releases
CREATE TABLE IF NOT EXISTS releases (
  id TEXT PRIMARY KEY,
  story_map_id TEXT NOT NULL REFERENCES story_maps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_releases_story_map_id ON releases(story_map_id);

-- Technical Requirements
CREATE TABLE IF NOT EXISTS technical_requirements (
  id TEXT PRIMARY KEY,
  story_map_id TEXT NOT NULL REFERENCES story_maps(id) ON DELETE CASCADE,
  source_story_ids TEXT NOT NULL DEFAULT '[]',  -- JSON array of story IDs
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK(category IN ('api','database','frontend','infrastructure','integration','security')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('high','medium','low')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Functional Requirements
CREATE TABLE IF NOT EXISTS functional_requirements (
  id TEXT PRIMARY KEY,
  story_map_id TEXT NOT NULL REFERENCES story_maps(id) ON DELETE CASCADE,
  source_story_ids TEXT NOT NULL DEFAULT '[]',  -- JSON array of story IDs
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  user_role TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK(category IN ('usability','functionality','performance','accessibility','data')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('high','medium','low')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### Database Initialization Update
```ts
// apps/api/src/db/index.ts (modify)
import { runMigrations } from './migrate';

let db: Database | null = null;

export function getDb(): Database {
  if (!db) {
    ensureDataDir();
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    runMigrations(db);
  }
  return db;
}
```

## Test Requirements

### Test: Migration runner
```
File: apps/api/src/db/migrate.test.ts

Test: "creates _migrations table"
- Run migrations on a fresh in-memory database
- Assert _migrations table exists

Test: "runs all migration files"
- Run migrations
- Assert _migrations table has a record for 001_initial_schema

Test: "does not re-run already applied migrations"
- Run migrations twice
- Assert each migration is recorded only once

Test: "migrations run in order"
- Create two migration files
- Assert they run in numerical order
```

### Test: Schema correctness
```
File: apps/api/src/db/schema.test.ts

Test: "story_maps table exists with correct columns"
- Query PRAGMA table_info(story_maps)
- Assert columns: id, title, description, created_at, updated_at

Test: "epics table has foreign key to story_maps"
- Insert an epic without a valid story_map_id
- Assert it fails with foreign key constraint error

Test: "deleting a story_map cascades to epics"
- Insert story_map → epic
- DELETE story_map
- Assert no epics remain

Test: "deleting an epic cascades to activities"
Test: "deleting an activity cascades to stories"

Test: "deleting a release sets stories.release_id to NULL"
- Insert release, assign a story to it
- DELETE release
- Assert story still exists with release_id = NULL

Test: "stories.priority CHECK constraint"
- Insert story with priority 'must' → succeeds
- Insert story with priority 'invalid' → fails

Test: "indexes exist on foreign key columns"
- Query sqlite_master for indexes
- Assert all expected indexes exist

Test: "WAL mode is enabled"
- Query PRAGMA journal_mode
- Assert 'wal'
```

## Dependencies
- Requires Issue #3 (Express + better-sqlite3 setup)
- Requires Issue #4 (shared types — used for validating data shape)

## Files to Create/Modify
- `apps/api/src/db/migrate.ts` (create)
- `apps/api/src/db/migrate.test.ts` (create)
- `apps/api/src/db/migrations/001_initial_schema.sql` (create)
- `apps/api/src/db/index.ts` (modify — call runMigrations)
- `apps/api/src/db/schema.test.ts` (create)
