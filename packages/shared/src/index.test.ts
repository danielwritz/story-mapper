import { describe, expect, it } from 'vitest';
import { APP_NAME } from './index';

describe('APP_NAME export', () => {
  it('APP_NAME is exported and equals Story Mapper', () => {
    expect(APP_NAME).toBe('Story Mapper');
  });
});
