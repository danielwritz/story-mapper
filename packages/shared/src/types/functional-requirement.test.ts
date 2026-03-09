import { describe, expect, it } from 'vitest';

import { FunctionalRequirementSchema } from './functional-requirement';

const baseRequirement = {
  id: '550e8400-e29b-41d4-a716-446655440300',
  storyMapId: '550e8400-e29b-41d4-a716-446655440301',
  sourceStoryIds: ['550e8400-e29b-41d4-a716-446655440302'],
  title: 'User can log in',
  description: 'The system shall allow users to authenticate using email and password.',
  userRole: 'end-user',
  category: 'usability' as const,
  priority: 'medium' as const,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-02T00:00:00.000Z'
};

describe('FunctionalRequirementSchema', () => {
  it('validates all fields', () => {
    expect(FunctionalRequirementSchema.safeParse(baseRequirement).success).toBe(true);
  });

  it('validates category enum', () => {
    const categories = ['usability', 'functionality', 'performance', 'accessibility', 'data'] as const;
    categories.forEach(category => {
      expect(FunctionalRequirementSchema.safeParse({ ...baseRequirement, category }).success).toBe(
        true
      );
    });
    expect(
      FunctionalRequirementSchema.safeParse({ ...baseRequirement, category: 'invalid' as never })
        .success
    ).toBe(false);
  });
});
