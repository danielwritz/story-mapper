import { describe, expect, it } from 'vitest';

import { StorySchema } from './story';

const baseStory = {
  id: '550e8400-e29b-41d4-a716-446655440100',
  activityId: '550e8400-e29b-41d4-a716-446655440101',
  storyMapId: '550e8400-e29b-41d4-a716-446655440102',
  releaseId: '550e8400-e29b-41d4-a716-446655440103',
  title: 'As a user I want to log in',
  description: 'As a user, I want to log in so I can access my account.',
  acceptanceCriteria: '- User can log in with email/password',
  priority: 'must',
  storyPoints: 3,
  sortOrder: 0,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-02T00:00:00.000Z'
};

describe('StorySchema', () => {
  it('validates a correct story', () => {
    expect(StorySchema.safeParse(baseStory).success).toBe(true);
  });

  it('validates priority enum', () => {
    const validPriorities: Array<typeof baseStory.priority> = ['must', 'should', 'could', 'wont'];
    validPriorities.forEach(priority => {
      expect(StorySchema.safeParse({ ...baseStory, priority }).success).toBe(true);
    });
    expect(StorySchema.safeParse({ ...baseStory, priority: 'invalid' as never }).success).toBe(
      false
    );
  });

  it('allows null releaseId', () => {
    expect(StorySchema.safeParse({ ...baseStory, releaseId: null }).success).toBe(true);
  });

  it('requires activityId', () => {
    const { activityId, ...withoutActivity } = baseStory;
    expect(StorySchema.safeParse(withoutActivity).success).toBe(false);
  });
});
