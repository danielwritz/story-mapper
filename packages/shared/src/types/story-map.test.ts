import { describe, expect, it } from 'vitest';

import { CreateStoryMapSchema, StoryMapSchema } from './story-map';

const baseTimestamps = {
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-02T00:00:00.000Z'
};

describe('StoryMapSchema', () => {
  it('validates a correct story map', () => {
    const validMap = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'My Story Map',
      description: 'A test map',
      ...baseTimestamps
    };

    const result = StoryMapSchema.safeParse(validMap);

    expect(result.success).toBe(true);
  });

  it('rejects missing title', () => {
    const invalidMap = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      description: 'A test map',
      ...baseTimestamps
    };

    const result = StoryMapSchema.safeParse(invalidMap);

    expect(result.success).toBe(false);
  });
});

describe('CreateStoryMapSchema', () => {
  it('omits id and timestamps', () => {
    const validCreate = {
      title: 'New Map',
      description: ''
    };

    expect(CreateStoryMapSchema.safeParse(validCreate).success).toBe(true);
    expect(
      CreateStoryMapSchema.safeParse({
        ...validCreate,
        id: '550e8400-e29b-41d4-a716-446655440000'
      }).success
    ).toBe(false);
  });
});
