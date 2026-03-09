import fs from 'fs';
import os from 'os';
import path from 'path';
import DatabaseConstructor, { Database as DatabaseInstance } from 'better-sqlite3';
import { describe, expect, it } from 'vitest';
import { runMigrations } from './migrate';

const { mkdtempSync } = fs;

function createMemoryDb(): DatabaseInstance {
  const db = new DatabaseConstructor(':memory:');
  db.pragma('foreign_keys = ON');
  return db;
}

describe('runMigrations', () => {
  it('creates _migrations table', () => {
    const db = createMemoryDb();

    runMigrations(db);

    const result = db.prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = '_migrations'`).get() as
      | { name?: string }
      | undefined;
    expect(result?.name).toBe('_migrations');
  });

  it('runs all migration files', () => {
    const db = createMemoryDb();

    runMigrations(db);

    const applied = db.prepare(`SELECT name FROM _migrations`).all() as Array<{ name: string }>;
    expect(applied.map((row) => row.name)).toContain('001_initial_schema.sql');
  });

  it('does not re-run already applied migrations', () => {
    const db = createMemoryDb();

    runMigrations(db);
    runMigrations(db);

    const rows = db.prepare(`SELECT name FROM _migrations WHERE name = ?`).all('001_initial_schema.sql');
    expect(rows.length).toBe(1);
  });

  it('migrations run in order', () => {
    const migrationsDir = mkdtempSync(path.join(os.tmpdir(), 'migrations-'));
    const db = createMemoryDb();

    const firstMigration = `CREATE TABLE order_test (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
INSERT INTO order_test (name) VALUES ('first');`;
    const secondMigration = `INSERT INTO order_test (name) VALUES ('second');`;

    fs.writeFileSync(path.join(migrationsDir, '001_first.sql'), firstMigration);
    fs.writeFileSync(path.join(migrationsDir, '002_second.sql'), secondMigration);

    runMigrations(db, migrationsDir);

    const names = (db.prepare(`SELECT name FROM order_test ORDER BY id`).all() as Array<{ name: string }>).map(
      (row) => row.name
    );
    expect(names).toEqual(['first', 'second']);
  });
});
