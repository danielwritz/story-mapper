import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  Activity,
  CreateStoryMapSchema,
  Epic,
  Release,
  Story,
  StoryMap,
  UpdateStoryMapSchema
} from '@story-mapper/shared';
import { getDb } from '../db';

type StoryMapRow = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
};

type EpicRow = {
  id: string;
  story_map_id: string;
  title: string;
  description: string;
  color: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type ActivityRow = {
  id: string;
  epic_id: string;
  story_map_id: string;
  title: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type ReleaseRow = {
  id: string;
  story_map_id: string;
  title: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type StoryRow = {
  id: string;
  activity_id: string;
  story_map_id: string;
  release_id: string | null;
  title: string;
  description: string;
  acceptance_criteria: string;
  priority: Story['priority'];
  story_points: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const router = express.Router();

const mapStoryMapRow = (row: StoryMapRow): StoryMap => ({
  id: row.id,
  title: row.title,
  description: row.description,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const mapEpicRow = (row: EpicRow): Epic => ({
  id: row.id,
  storyMapId: row.story_map_id,
  title: row.title,
  description: row.description,
  color: row.color,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const mapActivityRow = (row: ActivityRow): Activity => ({
  id: row.id,
  epicId: row.epic_id,
  storyMapId: row.story_map_id,
  title: row.title,
  description: row.description,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const mapReleaseRow = (row: ReleaseRow): Release => ({
  id: row.id,
  storyMapId: row.story_map_id,
  title: row.title,
  description: row.description,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const mapStoryRow = (row: StoryRow): Story => ({
  id: row.id,
  activityId: row.activity_id,
  storyMapId: row.story_map_id,
  releaseId: row.release_id,
  title: row.title,
  description: row.description,
  acceptanceCriteria: row.acceptance_criteria,
  priority: row.priority,
  storyPoints: row.story_points,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

router.post('/', (req, res) => {
  const parsed = CreateStoryMapSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();
  const title = parsed.data.title;
  const description = parsed.data.description ?? '';

  db.prepare(
    `INSERT INTO story_maps (id, title, description, created_at, updated_at)
     VALUES (@id, @title, @description, @createdAt, @updatedAt)`
  ).run({ id, title, description, createdAt: now, updatedAt: now });

  return res.status(201).json({
    id,
    title,
    description,
    createdAt: now,
    updatedAt: now
  });
});

router.get('/', (_req, res) => {
  const db = getDb();
  const rows = db
    .prepare(
      `
      SELECT
        sm.id,
        sm.title,
        sm.description,
        sm.created_at,
        sm.updated_at,
        (SELECT COUNT(*) FROM epics e WHERE e.story_map_id = sm.id) AS epicCount,
        (SELECT COUNT(*) FROM activities a WHERE a.story_map_id = sm.id) AS activityCount,
        (SELECT COUNT(*) FROM stories s WHERE s.story_map_id = sm.id) AS storyCount
      FROM story_maps sm
      ORDER BY sm.updated_at DESC
      `
    )
    .all();

  const result = rows.map(row => ({
    ...mapStoryMapRow(row as StoryMapRow),
    epicCount: (row as any).epicCount as number,
    activityCount: (row as any).activityCount as number,
    storyCount: (row as any).storyCount as number
  }));

  return res.status(200).json(result);
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const mapRow = db
    .prepare('SELECT id, title, description, created_at, updated_at FROM story_maps WHERE id = ?')
    .get(req.params.id) as StoryMapRow | undefined;

  if (!mapRow) {
    return res.status(404).json({ error: 'Story map not found' });
  }

  const epics = db
    .prepare('SELECT * FROM epics WHERE story_map_id = ? ORDER BY sort_order ASC')
    .all(mapRow.id) as EpicRow[];
  const activities = db
    .prepare('SELECT * FROM activities WHERE story_map_id = ? ORDER BY sort_order ASC')
    .all(mapRow.id) as ActivityRow[];
  const stories = db
    .prepare('SELECT * FROM stories WHERE story_map_id = ? ORDER BY sort_order ASC')
    .all(mapRow.id) as StoryRow[];
  const releases = db
    .prepare('SELECT * FROM releases WHERE story_map_id = ? ORDER BY sort_order ASC')
    .all(mapRow.id) as ReleaseRow[];

  return res.status(200).json({
    ...mapStoryMapRow(mapRow),
    epics: epics.map(mapEpicRow),
    activities: activities.map(mapActivityRow),
    stories: stories.map(mapStoryRow),
    releases: releases.map(mapReleaseRow)
  });
});

router.put('/:id', (req, res) => {
  const parsed = UpdateStoryMapSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const db = getDb();
  const existing = db
    .prepare('SELECT id, title, description, created_at, updated_at FROM story_maps WHERE id = ?')
    .get(req.params.id) as StoryMapRow | undefined;

  if (!existing) {
    return res.status(404).json({ error: 'Story map not found' });
  }

  const title = parsed.data.title ?? existing.title;
  const description = parsed.data.description ?? existing.description;
  const updatedAt = new Date().toISOString();

  db.prepare(
    `UPDATE story_maps
     SET title = @title, description = @description, updated_at = @updatedAt
     WHERE id = @id`
  ).run({ id: existing.id, title, description, updatedAt });

  return res.status(200).json({
    id: existing.id,
    title,
    description,
    createdAt: existing.created_at,
    updatedAt
  });
});

router.delete('/:id', (req, res) => {
  const db = getDb();
  const result = db.prepare('DELETE FROM story_maps WHERE id = ?').run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Story map not found' });
  }

  return res.status(204).send();
});

export const storyMapsRouter = router;
