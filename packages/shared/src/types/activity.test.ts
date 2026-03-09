import { describe, expect, it } from 'vitest';
import { ActivitySchema, CreateActivitySchema } from './activity';

describe('ActivitySchema', () => {
  const base = {
    id: '323e4567-e89b-12d3-a456-426614174000',
    epicId: '123e4567-e89b-12d3-a456-426614174000',
    storyMapId: '223e4567-e89b-12d3-a456-426614174000',
    title: 'Activity',
    description: '',
    sortOrder: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  it('validates a correct activity', () => {
    const result = ActivitySchema.safeParse(base);
    expect(result.success).toBe(true);
  });
});

describe('CreateActivitySchema', () => {
  it('omits auto-generated fields', () => {
    const result = CreateActivitySchema.safeParse({
      epicId: '123e4567-e89b-12d3-a456-426614174000',
      storyMapId: '223e4567-e89b-12d3-a456-426614174000',
      title: 'Activity',
      description: '',
      sortOrder: 1
    });
    expect(result.success).toBe(true);
  });
});
