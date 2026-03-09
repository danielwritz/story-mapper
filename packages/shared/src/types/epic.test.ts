import { describe, expect, it } from 'vitest';

import { CreateEpicSchema, EpicSchema } from './epic';

const baseTimestamps = {
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-02T00:00:00.000Z'
};

const baseEpic = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  storyMapId: '550e8400-e29b-41d4-a716-446655440001',
  title: 'Epic One',
  description: 'Description',
  color: '#6366f1',
  sortOrder: 1,
  ...baseTimestamps
};

describe('EpicSchema', () => {
  it('validates a correct epic', () => {
    expect(EpicSchema.safeParse(baseEpic).success).toBe(true);
  });

  it('validates color as hex string', () => {
    expect(EpicSchema.safeParse(baseEpic).success).toBe(true);
    expect(
      EpicSchema.safeParse({
        ...baseEpic,
        color: 'not-a-color'
      }).success
    ).toBe(false);
  });
});

describe('CreateEpicSchema', () => {
  it('works without id/timestamps', () => {
    const { id, createdAt, updatedAt, ...createEpic } = baseEpic;
    expect(CreateEpicSchema.safeParse(createEpic).success).toBe(true);
    expect(
      CreateEpicSchema.safeParse({
        ...createEpic,
        id
      }).success
    ).toBe(false);
  });
});
