import { describe, expect, it } from 'vitest';
import { CreateEpicSchema, EpicSchema } from './epic';

describe('EpicSchema', () => {
  const baseEpic = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    storyMapId: '223e4567-e89b-12d3-a456-426614174000',
    title: 'Epic',
    description: 'Desc',
    color: '#6366f1',
    sortOrder: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  it('validates a correct epic', () => {
    const result = EpicSchema.safeParse(baseEpic);
    expect(result.success).toBe(true);
  });

  it('validates color as hex string', () => {
    expect(EpicSchema.safeParse({ ...baseEpic, color: 'not-a-color' }).success).toBe(false);
  });
});

describe('CreateEpicSchema', () => {
  it('works without id/timestamps', () => {
    const result = CreateEpicSchema.safeParse({
      storyMapId: '223e4567-e89b-12d3-a456-426614174000',
      title: 'Epic',
      description: 'Desc',
      color: '#6366f1',
      sortOrder: 1
    });
    expect(result.success).toBe(true);
  });
});
