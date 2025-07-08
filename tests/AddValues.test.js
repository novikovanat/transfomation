import { describe, it, expect } from 'vitest';
import { AddValues } from '../src/classes/addValues.js';

// Helper for error expectation
function expectError(fn, msg) {
  expect(fn).toThrowError(msg ? new RegExp(msg) : undefined);
}

describe('AddValues', () => {
  it('adds number + number', () => {
    expect(new AddValues(2, 3).add()).toBe(5);
  });

  it('concatenates string + string', () => {
    expect(new AddValues('foo', 'bar').add()).toBe('foobar');
  });

  it('concatenates number + string', () => {
    expect(new AddValues(42, 'abc').add()).toBe('42abc');
  });

  it('concatenates string + number', () => {
    expect(new AddValues('abc', 42).add()).toBe('abc42');
  });

  it('adds number-like strings as numbers if possible', () => {
    expect(new AddValues('10', '20').add()).toBe(30);
    expect(new AddValues('100', 200).add()).toBe(300);
    expect(new AddValues(100, '200').add()).toBe(300);
  });

  it('concatenates if one string is not number-like', () => {
    expect(new AddValues('abc', '123').add()).toBe('abc123');
    expect(new AddValues('123', 'abc').add()).toBe('123abc');
    expect(new AddValues('abc', 123).add()).toBe('abc123');
    expect(new AddValues(123, 'abc').add()).toBe('123abc');
  });

  it('concatenates array + array', () => {
    expect(new AddValues([1, 2], [3, 4]).add()).toEqual([1, 2, 3, 4]);
    expect(new AddValues([], [5]).add()).toEqual([5]);
  });

  it('merges object + object', () => {
    expect(new AddValues({ a: 1 }, { b: 2 }).add()).toEqual({ a: 1, b: 2 });
    expect(new AddValues({}, { x: 5 }).add()).toEqual({ x: 5 });
  });

  it('throws for unsupported pairs (boolean, null, etc.)', () => {
    expectError(
      () => new AddValues(true, false).add(),
      'Addition not supported',
    );
    expectError(() => new AddValues(null, 1).add(), 'Addition not supported');
    expectError(() => new AddValues(1, null).add(), 'Addition not supported');
    expectError(() => new AddValues({}, []).add(), 'Addition not supported');
    expectError(() => new AddValues([], {}).add(), 'Addition not supported');
    expectError(
      () => new AddValues('foo', undefined).add(),
      'Addition not supported',
    );
    expectError(
      () => new AddValues(undefined, 'bar').add(),
      'Addition not supported',
    );
  });
});
