import fs from 'fs';
import path from 'path';
import type { Database } from 'better-sqlite3';

const DEFAULT_MIGRATIONS_DIR = path.join(__dirname, 'migrations');

function ensureMigrationsTable(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

export function runMigrations(db: Database, migrationsDir: string = DEFAULT_MIGRATIONS_DIR): void {
  ensureMigrationsTable(db);

  if (!fs.existsSync(migrationsDir)) {
    return;
  }

  const appliedRows = db.prepare(`SELECT name FROM _migrations`).all() as Array<{ name: string }>;
  const appliedMigrations = new Set<string>(appliedRows.map((row) => row.name));

  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  const recordMigration = db.prepare(`INSERT INTO _migrations (name) VALUES (?)`);
  const applyMigration = db.transaction((file: string, sql: string) => {
    db.exec(sql);
    recordMigration.run(file);
  });

  for (const file of migrationFiles) {
    if (appliedMigrations.has(file)) {
      continue;
    }

    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    applyMigration(file, sql);
  }
}

export { DEFAULT_MIGRATIONS_DIR };
