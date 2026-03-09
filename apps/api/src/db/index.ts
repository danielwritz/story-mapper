import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultDbPath = path.join(__dirname, '../../data/story-mapper.db');
let dbInstance: Database.Database | null = null;
let currentPath: string | null = null;

const resolveDbPath = (overridePath?: string) => {
  if (overridePath) {
    return overridePath;
  }

  const envPath = process.env.STORY_MAPPER_DB_PATH;
  if (envPath && envPath.trim().length > 0) {
    return envPath;
  }

  return defaultDbPath;
};

const ensureDirectory = (dbPath: string) => {
  const directory = path.dirname(dbPath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

export const getDb = (customPath?: string) => {
  const dbPath = resolveDbPath(customPath);

  if (dbInstance && currentPath === dbPath && dbInstance.open) {
    return dbInstance;
  }

  if (dbInstance && currentPath !== dbPath && dbInstance.open) {
    dbInstance.close();
  }

  ensureDirectory(dbPath);
  dbInstance = new Database(dbPath);
  currentPath = dbPath;

  return dbInstance;
};

export { defaultDbPath };
