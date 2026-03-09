import { describe, expect, it } from 'vitest';
import { StorySchema } from './story';

const baseStory = {
  id: crypto.randomUUID(),
  activityId: crypto.randomUUID(),
  storyMapId: crypto.randomUUID(),
  releaseId: null as string | null,
  title: 'Login story',
  description: 'As a user, I want to log in',
  acceptanceCriteria: '- Can log in\n- Remember me',
  priority: 'must' as const,
  storyPoints: 3,
  sortOrder: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

describe('StorySchema', () => {
  it('validates a correct story', () => {
    expect(StorySchema.safeParse(baseStory).success).toBe(true);
  });

  it('validates priority enum', () => {
    const validPriorities = ['must', 'should', 'could', 'wont'] as const;
    for (const priority of validPriorities) {
      expect(StorySchema.safeParse({ ...baseStory, priority }).success).toBe(true);
    }

    expect(StorySchema.safeParse({ ...baseStory, priority: 'invalid' }).success).toBe(false);
  });

  it('allows null releaseId', () => {
    expect(StorySchema.safeParse({ ...baseStory, releaseId: null }).success).toBe(true);
  });

  it('requires activityId', () => {
    const { activityId, ...rest } = baseStory;
    expect(StorySchema.safeParse(rest).success).toBe(false);
  });
});
