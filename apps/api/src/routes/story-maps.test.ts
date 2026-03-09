import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createServer } from '../server';
import { getDb, resetDb } from '../db';

const uuidV4Regex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const createMap = async (app: ReturnType<typeof createServer>, title = 'My Map') => {
  const response = await request(app)
    .post('/api/story-maps')
    .send({ title, description: 'Test' });
  return response.body as { id: string; title: string; description: string; createdAt: string; updatedAt: string };
};

describe('POST /api/story-maps', () => {
  beforeEach(() => {
    resetDb(':memory:');
  });

  it('creates a story map and returns 201', async () => {
    const app = createServer();
    const response = await request(app)
      .post('/api/story-maps')
      .send({ title: 'My Map', description: 'Test' });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('My Map');
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });

  it('returns 400 for missing title', async () => {
    const app = createServer();
    const response = await request(app).post('/api/story-maps').send({ description: 'No title' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it('returns 400 for empty title', async () => {
    const app = createServer();
    const response = await request(app).post('/api/story-maps').send({ title: '', description: '' });
    expect(response.status).toBe(400);
  });

  it('generates UUID for id', async () => {
    const app = createServer();
    const response = await request(app)
      .post('/api/story-maps')
      .send({ title: 'UUID Map', description: 'Test' });

    expect(response.status).toBe(201);
    expect(response.body.id).toMatch(uuidV4Regex);
  });
});

describe('GET /api/story-maps', () => {
  beforeEach(() => {
    resetDb(':memory:');
  });

  it('returns empty array when no maps exist', async () => {
    const app = createServer();
    const response = await request(app).get('/api/story-maps');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('returns all maps with counts', async () => {
    const app = createServer();
    const map1 = await createMap(app, 'Map 1');
    const map2 = await createMap(app, 'Map 2');

    const db = getDb();
    db.prepare(
      `INSERT INTO epics (id, story_map_id, title, description, color, sort_order, created_at, updated_at)
       VALUES ('11111111-1111-4111-8111-111111111111', @mapId, 'Epic', '', '#6366f1', 0, @now, @now)`
    ).run({ mapId: map1.id, now: new Date().toISOString() });

    db.prepare(
      `INSERT INTO activities (id, epic_id, story_map_id, title, description, sort_order, created_at, updated_at)
       VALUES ('22222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111111', @mapId, 'Activity', '', 0, @now, @now)`
    ).run({ mapId: map1.id, now: new Date().toISOString() });

    db.prepare(
      `INSERT INTO stories (id, activity_id, story_map_id, release_id, title, description, acceptance_criteria, priority, story_points, sort_order, created_at, updated_at)
       VALUES ('33333333-3333-4333-8333-333333333333', '22222222-2222-4222-8222-222222222222', @mapId, NULL, 'Story', '', '', 'must', 1, 0, @now, @now)`
    ).run({ mapId: map1.id, now: new Date().toISOString() });

    const response = await request(app).get('/api/story-maps');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);

    const mapWithCounts = response.body.find((m: any) => m.id === map1.id);
    expect(mapWithCounts.epicCount).toBe(1);
    expect(mapWithCounts.activityCount).toBe(1);
    expect(mapWithCounts.storyCount).toBe(1);

    const otherMap = response.body.find((m: any) => m.id === map2.id);
    expect(otherMap.epicCount).toBe(0);
    expect(otherMap.activityCount).toBe(0);
    expect(otherMap.storyCount).toBe(0);
  });

  it('maps are sorted by updatedAt descending (most recent first)', async () => {
    const app = createServer();
    const map1 = await createMap(app, 'Map 1');
    const map2 = await createMap(app, 'Map 2');

    await new Promise(resolve => setTimeout(resolve, 10));
    await request(app).put(`/api/story-maps/${map1.id}`).send({ title: 'Map 1 updated' });

    const response = await request(app).get('/api/story-maps');
    expect(response.status).toBe(200);
    expect(response.body[0].id).toBe(map1.id);
    expect(response.body[1].id).toBe(map2.id);
  });
});

describe('GET /api/story-maps/:id', () => {
  beforeEach(() => {
    resetDb(':memory:');
  });

  it('returns full story map with all children', async () => {
    const app = createServer();
    const map = await createMap(app, 'Full Map');
    const db = getDb();
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO epics (id, story_map_id, title, description, color, sort_order, created_at, updated_at)
       VALUES ('44444444-4444-4444-8444-444444444444', @mapId, 'Epic', '', '#6366f1', 0, @now, @now)`
    ).run({ mapId: map.id, now });

    db.prepare(
      `INSERT INTO activities (id, epic_id, story_map_id, title, description, sort_order, created_at, updated_at)
       VALUES ('55555555-5555-4555-8555-555555555555', '44444444-4444-4444-8444-444444444444', @mapId, 'Activity', '', 0, @now, @now)`
    ).run({ mapId: map.id, now });

    db.prepare(
      `INSERT INTO releases (id, story_map_id, title, description, sort_order, created_at, updated_at)
       VALUES ('77777777-7777-4777-8777-777777777777', @mapId, 'Release', '', 0, @now, @now)`
    ).run({ mapId: map.id, now });

    db.prepare(
      `INSERT INTO stories (id, activity_id, story_map_id, release_id, title, description, acceptance_criteria, priority, story_points, sort_order, created_at, updated_at)
       VALUES ('66666666-6666-4666-8666-666666666666', '55555555-5555-4555-8555-555555555555', @mapId, '77777777-7777-4777-8777-777777777777', 'Story', '', '', 'must', 1, 0, @now, @now)`
    ).run({ mapId: map.id, now });

    const response = await request(app).get(`/api/story-maps/${map.id}`);
    expect(response.status).toBe(200);
    expect(response.body.epics).toHaveLength(1);
    expect(response.body.activities).toHaveLength(1);
    expect(response.body.stories).toHaveLength(1);
    expect(response.body.releases).toHaveLength(1);
  });

  it('returns 404 for non-existent id', async () => {
    const app = createServer();
    const response = await request(app).get('/api/story-maps/non-existent-uuid');
    expect(response.status).toBe(404);
    expect(response.body.error).toMatch(/not found/i);
  });
});

describe('PUT /api/story-maps/:id', () => {
  beforeEach(() => {
    resetDb(':memory:');
  });

  it('updates title and returns updated map', async () => {
    const app = createServer();
    const map = await createMap(app, 'Map Original');

    await new Promise(resolve => setTimeout(resolve, 10));

    const response = await request(app)
      .put(`/api/story-maps/${map.id}`)
      .send({ title: 'Updated Title' });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Title');
    expect(response.body.updatedAt).not.toBe(map.updatedAt);
  });

  it('returns 404 for non-existent id', async () => {
    const app = createServer();
    const response = await request(app).put('/api/story-maps/non-existent').send({ title: 'Nope' });
    expect(response.status).toBe(404);
  });

  it('returns 400 for invalid body', async () => {
    const app = createServer();
    const map = await createMap(app, 'Map Original');
    const response = await request(app).put(`/api/story-maps/${map.id}`).send({ title: '' });
    expect(response.status).toBe(400);
  });
});

describe('DELETE /api/story-maps/:id', () => {
  beforeEach(() => {
    resetDb(':memory:');
  });

  it('deletes map and returns 204', async () => {
    const app = createServer();
    const map = await createMap(app, 'Delete Map');
    const deleteRes = await request(app).delete(`/api/story-maps/${map.id}`);
    expect(deleteRes.status).toBe(204);

    const getRes = await request(app).get(`/api/story-maps/${map.id}`);
    expect(getRes.status).toBe(404);
  });

  it('cascade deletes children', async () => {
    const app = createServer();
    const map = await createMap(app, 'Cascade Map');
    const db = getDb();
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO epics (id, story_map_id, title, description, color, sort_order, created_at, updated_at)
       VALUES ('88888888-8888-4888-8888-888888888888', @mapId, 'Epic', '', '#6366f1', 0, @now, @now)`
    ).run({ mapId: map.id, now });

    db.prepare(
      `INSERT INTO activities (id, epic_id, story_map_id, title, description, sort_order, created_at, updated_at)
       VALUES ('99999999-9999-4999-8999-999999999999', '88888888-8888-4888-8888-888888888888', @mapId, 'Activity', '', 0, @now, @now)`
    ).run({ mapId: map.id, now });

    db.prepare(
      `INSERT INTO stories (id, activity_id, story_map_id, release_id, title, description, acceptance_criteria, priority, story_points, sort_order, created_at, updated_at)
       VALUES ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '99999999-9999-4999-8999-999999999999', @mapId, NULL, 'Story', '', '', 'must', 1, 0, @now, @now)`
    ).run({ mapId: map.id, now });

    const deleteRes = await request(app).delete(`/api/story-maps/${map.id}`);
    expect(deleteRes.status).toBe(204);

    const epicCount = db.prepare('SELECT COUNT(*) as count FROM epics').get() as { count: number };
    const activityCount = db.prepare('SELECT COUNT(*) as count FROM activities').get() as { count: number };
    const storyCount = db.prepare('SELECT COUNT(*) as count FROM stories').get() as { count: number };
    expect(epicCount.count).toBe(0);
    expect(activityCount.count).toBe(0);
    expect(storyCount.count).toBe(0);
  });

  it('returns 404 for non-existent id', async () => {
    const app = createServer();
    const response = await request(app).delete('/api/story-maps/non-existent');
    expect(response.status).toBe(404);
  });
});
