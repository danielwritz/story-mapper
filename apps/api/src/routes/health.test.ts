import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../server';

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(() => new Date(response.body.timestamp).toISOString()).not.toThrow();
  });

  it('returns JSON content type', async () => {
    const response = await request(app).get('/api/health');

    expect(response.headers['content-type']).toContain('application/json');
  });
});
