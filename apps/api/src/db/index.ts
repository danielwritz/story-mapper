import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import type { Database as DatabaseInstance } from 'better-sqlite3';
import { runMigrations } from './migrate';

const DB_PATH = path.resolve(__dirname, '../../data/story-mapper.db');

let db: DatabaseInstance | null = null;

function ensureDataDir(): void {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

export function getDb(): DatabaseInstance {
  if (!db) {
    ensureDataDir();
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    runMigrations(db);
  }

  return db;
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

export { DB_PATH, ensureDataDir };
