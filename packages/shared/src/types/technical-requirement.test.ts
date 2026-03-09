import { describe, expect, it } from 'vitest';

import { TechnicalRequirementSchema } from './technical-requirement';

const baseRequirement = {
  id: '550e8400-e29b-41d4-a716-446655440200',
  storyMapId: '550e8400-e29b-41d4-a716-446655440201',
  sourceStoryIds: ['550e8400-e29b-41d4-a716-446655440202'],
  title: 'Create authentication API',
  description: 'Implement secure authentication endpoints.',
  category: 'api' as const,
  priority: 'high' as const,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-02T00:00:00.000Z'
};

describe('TechnicalRequirementSchema', () => {
  it('validates category enum', () => {
    const categories = ['api', 'database', 'frontend', 'infrastructure', 'integration', 'security'] as const;
    categories.forEach(category => {
      expect(TechnicalRequirementSchema.safeParse({ ...baseRequirement, category }).success).toBe(
        true
      );
    });
    expect(
      TechnicalRequirementSchema.safeParse({ ...baseRequirement, category: 'invalid' as never })
        .success
    ).toBe(false);
  });

  it('validates sourceStoryIds as an array of strings', () => {
    expect(TechnicalRequirementSchema.safeParse({ ...baseRequirement, sourceStoryIds: [] }).success).toBe(
      true
    );
    expect(
      TechnicalRequirementSchema.safeParse({
        ...baseRequirement,
        sourceStoryIds: ['id1', 'id2']
      }).success
    ).toBe(true);
    expect(
      TechnicalRequirementSchema.safeParse({
        ...baseRequirement,
        sourceStoryIds: [123 as never]
      }).success
    ).toBe(false);
  });
});
