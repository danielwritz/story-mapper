import { describe, expect, it } from 'vitest';
import { CreateEpicSchema, EpicSchema } from './epic';

const baseEpic = {
  id: crypto.randomUUID(),
  storyMapId: crypto.randomUUID(),
  title: 'User Management',
  description: 'Manage users',
  color: '#6366f1',
  sortOrder: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

describe('EpicSchema', () => {
  it('validates a correct epic', () => {
    expect(EpicSchema.safeParse(baseEpic).success).toBe(true);
  });

  it('validates color as hex string', () => {
    expect(EpicSchema.safeParse({ ...baseEpic, color: '#6366f1' }).success).toBe(true);
    expect(EpicSchema.safeParse({ ...baseEpic, color: 'not-a-color' }).success).toBe(false);
  });
});

describe('CreateEpicSchema', () => {
  it('works without id/timestamps', () => {
    const { id, createdAt, updatedAt, ...rest } = baseEpic;
    expect(CreateEpicSchema.safeParse(rest).success).toBe(true);
  });
});
