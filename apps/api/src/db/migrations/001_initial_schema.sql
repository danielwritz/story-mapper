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

-- Technical Requirements
CREATE TABLE IF NOT EXISTS technical_requirements (
  id TEXT PRIMARY KEY,
  story_map_id TEXT NOT NULL REFERENCES story_maps(id) ON DELETE CASCADE,
  source_story_ids TEXT NOT NULL DEFAULT '[]',
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
  source_story_ids TEXT NOT NULL DEFAULT '[]',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  user_role TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK(category IN ('usability','functionality','performance','accessibility','data')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('high','medium','low')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
