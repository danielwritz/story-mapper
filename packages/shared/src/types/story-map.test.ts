import { describe, expect, it } from 'vitest';
import { CreateStoryMapSchema, StoryMapSchema } from './story-map';

describe('StoryMapSchema', () => {
  it('validates a correct story map', () => {
    const validMap = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'My Map',
      description: 'Test map',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = StoryMapSchema.safeParse(validMap);
    expect(result.success).toBe(true);
  });

  it('rejects missing title', () => {
    const result = StoryMapSchema.safeParse({
      id: '123e4567-e89b-12d3-a456-426614174000',
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    expect(result.success).toBe(false);
  });
});

describe('CreateStoryMapSchema', () => {
  it('omits id and timestamps', () => {
    const result = CreateStoryMapSchema.safeParse({ title: 'Test', description: '' });
    expect(result.success).toBe(true);

    const withId = CreateStoryMapSchema.safeParse({ id: '123', title: 'Test', description: '' } as never);
    expect(withId.success).toBe(false);
  });

  it('rejects empty title', () => {
    const result = CreateStoryMapSchema.safeParse({ title: '', description: '' });
    expect(result.success).toBe(false);
  });
});
