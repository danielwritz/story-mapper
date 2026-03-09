import { describe, expect, it } from 'vitest';
import { StorySchema } from './story';

describe('StorySchema', () => {
  const base = {
    id: '423e4567-e89b-12d3-a456-426614174000',
    activityId: '323e4567-e89b-12d3-a456-426614174000',
    storyMapId: '223e4567-e89b-12d3-a456-426614174000',
    releaseId: null,
    title: 'Story',
    description: 'As a user, I want...',
    acceptanceCriteria: 'Given, When, Then',
    priority: 'must' as const,
    storyPoints: 3,
    sortOrder: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  it('validates a correct story', () => {
    expect(StorySchema.safeParse(base).success).toBe(true);
  });

  it('validates priority enum', () => {
    const validPriorities = ['must', 'should', 'could', 'wont'] as const;
    validPriorities.forEach(priority => {
      expect(StorySchema.safeParse({ ...base, priority }).success).toBe(true);
    });
    expect(StorySchema.safeParse({ ...base, priority: 'invalid' as never }).success).toBe(false);
  });

  it('allows null releaseId', () => {
    expect(StorySchema.safeParse({ ...base, releaseId: null }).success).toBe(true);
  });

  it('requires activityId', () => {
    expect(StorySchema.safeParse({ ...base, activityId: undefined as never }).success).toBe(false);
  });
});
