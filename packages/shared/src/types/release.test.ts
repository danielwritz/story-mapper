import { describe, expect, it } from 'vitest';

import { CreateReleaseSchema, ReleaseSchema } from './release';

const baseRelease = {
  id: '550e8400-e29b-41d4-a716-446655440010',
  storyMapId: '550e8400-e29b-41d4-a716-446655440000',
  title: 'MVP',
  description: 'First release',
  sortOrder: 0,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-02T00:00:00.000Z'
};

describe('ReleaseSchema', () => {
  it('validates a correct release', () => {
    expect(ReleaseSchema.safeParse(baseRelease).success).toBe(true);
  });
});

describe('CreateReleaseSchema', () => {
  it('omits auto-generated fields', () => {
    const { id, createdAt, updatedAt, ...createRelease } = baseRelease;
    expect(CreateReleaseSchema.safeParse(createRelease).success).toBe(true);
    expect(
      CreateReleaseSchema.safeParse({
        ...createRelease,
        id
      }).success
    ).toBe(false);
  });
});
