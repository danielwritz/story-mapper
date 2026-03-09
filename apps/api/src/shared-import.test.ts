import { describe, expect, it } from 'vitest';
import { APP_NAME } from '@story-mapper/shared';

describe('shared import in api app', () => {
  it('can import from @story-mapper/shared', () => {
    expect(APP_NAME).toBeDefined();
    expect(typeof APP_NAME).toBe('string');
  });
});
