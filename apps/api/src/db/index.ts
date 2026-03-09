import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { runMigrations } from './migrate';

const DEFAULT_DB_PATH = path.join(__dirname, '../../data/story-mapper.db');

let db: Database.Database | null = null;

function ensureDataDir(dbPath: string): void {
  if (dbPath === ':memory:') {
    return;
  }
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getDb(): Database.Database {
  if (db) {
    return db;
  }

  const dbPath = process.env.DB_PATH || DEFAULT_DB_PATH;
  ensureDataDir(dbPath);
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  runMigrations(db);
  return db;
}

export function resetDb(customPath?: string): void {
  if (db) {
    db.close();
    db = null;
  }
  if (customPath) {
    process.env.DB_PATH = customPath;
  } else {
    delete process.env.DB_PATH;
  }
}
