import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import { getDb } from './index';

const createdPaths: string[] = [];

afterEach(() => {
  delete process.env.STORY_MAPPER_DB_PATH;

  for (const dbPath of createdPaths) {
    if (fs.existsSync(dbPath)) {
      fs.rmSync(dbPath);
    }
    const directory = path.dirname(dbPath);
    if (fs.existsSync(directory) && fs.readdirSync(directory).length === 0) {
      fs.rmdirSync(directory);
    }
  }

  createdPaths.length = 0;
});

const buildTestPath = () =>
  path.join(os.tmpdir(), 'story-mapper-tests', `db-${crypto.randomUUID()}.sqlite`);

describe('database initialization', () => {
  it('getDb returns a database instance', () => {
    const dbPath = buildTestPath();
    createdPaths.push(dbPath);

    const db = getDb(dbPath);
    expect(typeof db.prepare).toBe('function');
    db.close();
  });

  it('database file is created in data directory', () => {
    const dbPath = buildTestPath();
    createdPaths.push(dbPath);
    process.env.STORY_MAPPER_DB_PATH = dbPath;

    const db = getDb();
    db.close();

    expect(fs.existsSync(dbPath)).toBe(true);
  });
});
