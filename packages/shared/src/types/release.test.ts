import { describe, expect, it } from 'vitest';
import { CreateReleaseSchema, ReleaseSchema } from './release';

describe('ReleaseSchema', () => {
  const base = {
    id: '523e4567-e89b-12d3-a456-426614174000',
    storyMapId: '223e4567-e89b-12d3-a456-426614174000',
    title: 'Release',
    description: '',
    sortOrder: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  it('validates a correct release', () => {
    expect(ReleaseSchema.safeParse(base).success).toBe(true);
  });
});

describe('CreateReleaseSchema', () => {
  it('omits auto-generated fields', () => {
    const result = CreateReleaseSchema.safeParse({
      storyMapId: '223e4567-e89b-12d3-a456-426614174000',
      title: 'Release',
      description: '',
      sortOrder: 1
    });
    expect(result.success).toBe(true);
  });
});
