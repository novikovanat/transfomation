import { invertBoolean } from '../src/invertBoolean.js';

import { describe, it, expect } from 'vitest';

describe('invertBoolean', () => {
  it('should return false for true input', () => {
    expect(invertBoolean(true)).toBe(false);
  });

  it('should return true for false input', () => {
    expect(invertBoolean(false)).toBe(true);
  });

  it('should throw an error for string input', () => {
    expect(() => invertBoolean('true')).toThrowError('Invalid type');
  });

  it('should throw an error for number input', () => {
    expect(() => invertBoolean(1)).toThrowError('Invalid type');
  });

  it('should throw an error for null input', () => {
    expect(() => invertBoolean(null)).toThrowError('Invalid type');
  });

  it('should throw an error for undefined input', () => {
    expect(() => invertBoolean(undefined)).toThrowError('Invalid type');
  });

  it('should throw an error for object input', () => {
    expect(() => invertBoolean({})).toThrowError('Invalid type');
  });

  it('should throw an error for array input', () => {
    expect(() => invertBoolean([])).toThrowError('Invalid type');
  });
});
