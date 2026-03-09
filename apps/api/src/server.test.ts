import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from './server';

describe('server configuration', () => {
  it('includes CORS headers for localhost:5173', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:5173');

    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });

  it('accepts JSON request bodies', async () => {
    const payload = { hello: 'world' };
    const response = await request(app).post('/api/health').send(payload);

    expect(response.status).toBe(200);
    expect(response.body.received).toEqual(payload);
  });
});
