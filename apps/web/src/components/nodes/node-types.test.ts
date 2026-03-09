import { describe, expect, it } from 'vitest';
import { nodeTypes } from './node-types';

describe('nodeTypes registry', () => {
  it('exports all three node types', () => {
    expect(nodeTypes.epic).toBeDefined();
    expect(nodeTypes.activity).toBeDefined();
    expect(nodeTypes.story).toBeDefined();
  });
});
