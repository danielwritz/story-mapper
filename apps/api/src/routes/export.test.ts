import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import type { StoryMapDetail } from '@story-mapper/shared';
import { app } from '../server';
import { clearStoryMaps, setStoryMaps } from '../data/story-map-store';

const mapId = 'map-123';

const storyMap: StoryMapDetail = {
  id: mapId,
  title: 'Sample Map',
  description: 'Demo description',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  epics: [
    {
      id: 'epic-1',
      storyMapId: mapId,
      title: 'Epic One',
      description: 'Epic description',
      color: '#123456',
      sortOrder: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  activities: [
    {
      id: 'act-1',
      epicId: 'epic-1',
      storyMapId: mapId,
      title: 'Activity One',
      description: 'Activity description',
      sortOrder: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  stories: [
    {
      id: 'story-1',
      activityId: 'act-1',
      storyMapId: mapId,
      releaseId: 'rel-1',
      title: 'Story One',
      description: 'Story description',
      acceptanceCriteria: '',
      priority: 'must',
      storyPoints: 5,
      sortOrder: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'story-2',
      activityId: 'act-1',
      storyMapId: mapId,
      releaseId: 'rel-2',
      title: 'Story Two',
      description: 'Story 2 description',
      acceptanceCriteria: '',
      priority: 'should',
      storyPoints: 3,
      sortOrder: 2,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  releases: [
    {
      id: 'rel-1',
      storyMapId: mapId,
      title: 'Release 1',
      description: 'First release',
      sortOrder: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'rel-2',
      storyMapId: mapId,
      title: 'Release 2',
      description: 'Second release',
      sortOrder: 2,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  technicalRequirements: [
    {
      id: 'tr-100',
      storyMapId: mapId,
      sourceStoryIds: ['story-1'],
      title: 'API design',
      description: 'Build API',
      category: 'api',
      priority: 'high',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  functionalRequirements: [
    {
      id: 'fr-100',
      storyMapId: mapId,
      sourceStoryIds: ['story-1'],
      title: 'Checkout flow',
      description: 'User can checkout',
      userRole: 'Shopper',
      category: 'functionality',
      priority: 'medium',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
};

beforeEach(() => {
  clearStoryMaps();
  setStoryMaps([storyMap]);
});

describe('export routes', () => {
  it('GET /export/full returns markdown content type', async () => {
    const response = await request(app).get(`/api/story-maps/${mapId}/export/full`);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/markdown');
    expect(response.headers['content-disposition']).toContain('filename="sample-map-full');
  });

  it('GET /export/overview returns story map overview', async () => {
    const response = await request(app).get(`/api/story-maps/${mapId}/export/overview`);
    expect(response.text).toContain('Epic: Epic One');
    expect(response.text).toContain('Story One');
  });

  it('GET /export/technical returns technical requirements', async () => {
    const response = await request(app).get(`/api/story-maps/${mapId}/export/technical`);
    expect(response.text).toContain('Technical Requirements');
    expect(response.text).toContain('API design');
  });

  it('GET /export/functional returns functional requirements', async () => {
    const response = await request(app).get(`/api/story-maps/${mapId}/export/functional`);
    expect(response.text).toContain('Functional Requirements');
    expect(response.text).toContain('Checkout flow');
  });

  it('returns 404 for non-existent map', async () => {
    const response = await request(app).get('/api/story-maps/not-found/export/full');
    expect(response.status).toBe(404);
    expect(response.body.error).toContain('Story map not found');
  });

  it('returns 400 for invalid export type', async () => {
    const response = await request(app).get(`/api/story-maps/${mapId}/export/invalid`);
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Invalid export type');
  });

  it('supports releaseId query parameter', async () => {
    const response = await request(app).get(`/api/story-maps/${mapId}/export/overview?releaseId=rel-1`);
    expect(response.text).toContain('Story One');
    expect(response.text).not.toContain('Story Two');
  });
});
