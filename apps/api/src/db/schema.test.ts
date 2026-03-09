import fs from 'fs';
import path from 'path';
import DatabaseConstructor, { Database as DatabaseInstance } from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';
import { DB_PATH, closeDb, ensureDataDir, getDb } from './index';
import { runMigrations } from './migrate';

function createMigratedMemoryDb(): DatabaseInstance {
  const db = new DatabaseConstructor(':memory:');
  db.pragma('foreign_keys = ON');
  runMigrations(db);
  return db;
}

afterEach(() => {
  closeDb();
  if (fs.existsSync(DB_PATH)) {
    fs.rmSync(DB_PATH);
  }
});

describe('database schema', () => {
  it('story_maps table exists with correct columns', () => {
    const db = createMigratedMemoryDb();
    const columns = (db.prepare(`PRAGMA table_info(story_maps)`).all() as Array<{ name: string }>).map((row) => row.name);

    expect(columns).toEqual(expect.arrayContaining(['id', 'title', 'description', 'created_at', 'updated_at']));
  });

  it('epics table has foreign key to story_maps', () => {
    const db = createMigratedMemoryDb();

    const insertEpic = () =>
      db
        .prepare(
          `INSERT INTO epics (id, story_map_id, title, description, color, sort_order) VALUES (?, ?, ?, ?, ?, ?)`
        )
        .run('epic-1', 'missing-map', 'Title', 'Desc', '#fff', 0);

    expect(insertEpic).toThrowError(/FOREIGN KEY constraint failed/);
  });

  it('deleting a story_map cascades to epics', () => {
    const db = createMigratedMemoryDb();
    db.prepare(`INSERT INTO story_maps (id, title) VALUES (?, ?)`).run('map-1', 'Map');
    db
      .prepare(`INSERT INTO epics (id, story_map_id, title, description, color, sort_order) VALUES (?, ?, ?, ?, ?, ?)`)
      .run('epic-1', 'map-1', 'Epic', '', '#fff', 0);

    db.prepare(`DELETE FROM story_maps WHERE id = ?`).run('map-1');

    const epics = db.prepare(`SELECT * FROM epics`).all();
    expect(epics.length).toBe(0);
  });

  it('deleting an epic cascades to activities', () => {
    const db = createMigratedMemoryDb();
    db.prepare(`INSERT INTO story_maps (id, title) VALUES (?, ?)`).run('map-1', 'Map');
    db
      .prepare(`INSERT INTO epics (id, story_map_id, title, description, color, sort_order) VALUES (?, ?, ?, ?, ?, ?)`)
      .run('epic-1', 'map-1', 'Epic', '', '#fff', 0);
    db
      .prepare(
        `INSERT INTO activities (id, epic_id, story_map_id, title, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run('act-1', 'epic-1', 'map-1', 'Activity', '', 0);

    db.prepare(`DELETE FROM epics WHERE id = ?`).run('epic-1');

    const activities = db.prepare(`SELECT * FROM activities`).all();
    expect(activities.length).toBe(0);
  });

  it('deleting an activity cascades to stories', () => {
    const db = createMigratedMemoryDb();
    db.prepare(`INSERT INTO story_maps (id, title) VALUES (?, ?)`).run('map-1', 'Map');
    db
      .prepare(`INSERT INTO epics (id, story_map_id, title, description, color, sort_order) VALUES (?, ?, ?, ?, ?, ?)`)
      .run('epic-1', 'map-1', 'Epic', '', '#fff', 0);
    db
      .prepare(
        `INSERT INTO activities (id, epic_id, story_map_id, title, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run('act-1', 'epic-1', 'map-1', 'Activity', '', 0);
    db
      .prepare(
        `INSERT INTO stories (id, activity_id, story_map_id, title, description, acceptance_criteria, priority, story_points, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run('story-1', 'act-1', 'map-1', 'Story', '', '', 'must', null, 0);

    db.prepare(`DELETE FROM activities WHERE id = ?`).run('act-1');

    const stories = db.prepare(`SELECT * FROM stories`).all();
    expect(stories.length).toBe(0);
  });

  it('deleting a release sets stories.release_id to NULL', () => {
    const db = createMigratedMemoryDb();
    db.prepare(`INSERT INTO story_maps (id, title) VALUES (?, ?)`).run('map-1', 'Map');
    db
      .prepare(`INSERT INTO epics (id, story_map_id, title, description, color, sort_order) VALUES (?, ?, ?, ?, ?, ?)`)
      .run('epic-1', 'map-1', 'Epic', '', '#fff', 0);
    db
      .prepare(
        `INSERT INTO activities (id, epic_id, story_map_id, title, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run('act-1', 'epic-1', 'map-1', 'Activity', '', 0);
    db
      .prepare(
        `INSERT INTO releases (id, story_map_id, title, description, sort_order) VALUES (?, ?, ?, ?, ?)`
      )
      .run('rel-1', 'map-1', 'Release', '', 0);
    db
      .prepare(
        `INSERT INTO stories (id, activity_id, story_map_id, release_id, title, description, acceptance_criteria, priority, story_points, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run('story-1', 'act-1', 'map-1', 'rel-1', 'Story', '', '', 'could', null, 0);

    db.prepare(`DELETE FROM releases WHERE id = ?`).run('rel-1');

    const story = db.prepare(`SELECT release_id FROM stories WHERE id = ?`).get('story-1') as {
      release_id: string | null;
    };
    expect(story.release_id).toBeNull();
  });

  it('stories.priority CHECK constraint', () => {
    const db = createMigratedMemoryDb();
    db.prepare(`INSERT INTO story_maps (id, title) VALUES (?, ?)`).run('map-1', 'Map');
    db
      .prepare(`INSERT INTO epics (id, story_map_id, title, description, color, sort_order) VALUES (?, ?, ?, ?, ?, ?)`)
      .run('epic-1', 'map-1', 'Epic', '', '#fff', 0);
    db
      .prepare(
        `INSERT INTO activities (id, epic_id, story_map_id, title, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run('act-1', 'epic-1', 'map-1', 'Activity', '', 0);

    const insertValid = () =>
      db
        .prepare(
          `INSERT INTO stories (id, activity_id, story_map_id, title, description, acceptance_criteria, priority, story_points, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run('story-1', 'act-1', 'map-1', 'Story', '', '', 'must', 1, 0);
    const insertInvalid = () =>
      db
        .prepare(
          `INSERT INTO stories (id, activity_id, story_map_id, title, description, acceptance_criteria, priority, story_points, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run('story-2', 'act-1', 'map-1', 'Story', '', '', 'invalid', 1, 1);

    expect(insertValid).not.toThrow();
    expect(insertInvalid).toThrowError(/CHECK constraint failed/);
  });

  it('indexes exist on foreign key columns', () => {
    const db = createMigratedMemoryDb();
    const indexes = (db.prepare(`SELECT name FROM sqlite_master WHERE type = 'index'`).all() as Array<{ name: string }>).map(
      (row) => row.name
    );

    expect(indexes).toEqual(
      expect.arrayContaining([
        'idx_epics_story_map_id',
        'idx_activities_epic_id',
        'idx_activities_story_map_id',
        'idx_stories_activity_id',
        'idx_stories_story_map_id',
        'idx_stories_release_id',
        'idx_releases_story_map_id'
      ])
    );
  });

  it('WAL mode is enabled', () => {
    ensureDataDir();
    const db = getDb();

    const journalMode = db.pragma('journal_mode', { simple: true });
    expect(journalMode).toBe('wal');
  });
});
