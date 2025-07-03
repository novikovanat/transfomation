import { describe, it, expect } from 'vitest';
import { StringifyValue } from '../src/classes/StringifyValue.js';

describe('StringifyValue - toString method', () => {
  it('converts string to string', () => {
    const stringifier = new StringifyValue('hello world');
    expect(stringifier.toString()).toBe('hello world');
  });

  it('converts number to string', () => {
    const stringifier = new StringifyValue(42);
    expect(stringifier.toString()).toBe('42');
  });

  it('converts decimal number to string', () => {
    const stringifier = new StringifyValue(3.14159);
    expect(stringifier.toString()).toBe('3.14159');
  });

  it('converts boolean to string', () => {
    const trueStringifier = new StringifyValue(true);
    const falseStringifier = new StringifyValue(false);
    expect(trueStringifier.toString()).toBe('true');
    expect(falseStringifier.toString()).toBe('false');
  });

  it('converts null to string', () => {
    const stringifier = new StringifyValue(null);
    expect(stringifier.toString()).toBe('null');
  });

  it('converts undefined to string', () => {
    const stringifier = new StringifyValue(undefined);
    expect(stringifier.toString()).toBe('undefined');
  });

  it('converts array to JSON string', () => {
    const stringifier = new StringifyValue([1, 2, 3, 'hello']);
    expect(stringifier.toString()).toBe('[1,2,3,"hello"]');
  });

  it('converts object to JSON string', () => {
    const stringifier = new StringifyValue({ name: 'John', age: 30 });
    expect(stringifier.toString()).toBe('{"name":"John","age":30}');
  });

  it('converts nested object to JSON string', () => {
    const stringifier = new StringifyValue({
      user: { name: 'Alice', details: { age: 25, city: 'NYC' } },
      active: true,
    });
    expect(stringifier.toString()).toBe(
      '{"user":{"name":"Alice","details":{"age":25,"city":"NYC"}},"active":true}',
    );
  });

  it('converts function to string', () => {
    const testFunction = function () {
      return 'test';
    };
    const stringifier = new StringifyValue(testFunction);
    expect(stringifier.toString()).toContain('function');
  });

  it('converts symbol to string', () => {
    const symbol = Symbol('test');
    const stringifier = new StringifyValue(symbol);
    expect(stringifier.toString()).toBe('Symbol(test)');
  });

  it('converts bigint to string', () => {
    const stringifier = new StringifyValue(BigInt(123456789));
    expect(stringifier.toString()).toBe('123456789');
  });
});

describe('StringifyValue - edge cases', () => {
  it('handles objects with circular references', () => {
    const obj = { name: 'test' };
    obj.self = obj;
    const stringifier = new StringifyValue(obj);

    // Should detect circular reference and return a message instead of throwing
    expect(stringifier.toString()).toBe(
      '{"name":"test","self":"[Circular Reference]"}',
    );
  });

  it('handles nested circular references', () => {
    const parent = { name: 'parent' };
    const child = { name: 'child', parent: parent };
    parent.child = child;

    const stringifier = new StringifyValue(parent);
    expect(stringifier.toString()).toBe(
      '{"name":"parent","child":{"name":"child","parent":"[Circular Reference]"}}',
    );
  });

  it('handles complex circular reference chains', () => {
    const a = { name: 'a' };
    const b = { name: 'b', ref: a };
    const c = { name: 'c', ref: b };
    a.ref = c;

    const stringifier = new StringifyValue(a);
    expect(stringifier.toString()).toBe(
      '{"name":"a","ref":{"name":"c","ref":{"name":"b","ref":"[Circular Reference]"}}}',
    );
  });

  it('handles objects with undefined values', () => {
    const stringifier = new StringifyValue({ key: undefined });
    expect(stringifier.toString()).toBe('{}');
  });
  it('handles objects with null values', () => {
    const stringifier = new StringifyValue({ key: null });
    expect(stringifier.toString()).toBe('{"key":null}');
  });

  it('handles objects with functions', () => {
    const stringifier = new StringifyValue({
      func: function () {
        return 'test';
      },
      name: 'test',
    });
    expect(stringifier.toString()).toBe('{"name":"test"}');
  });

  it('handles special characters in strings', () => {
    const stringifier = new StringifyValue('Hello\nWorld\t"quoted"');
    expect(stringifier.toString()).toBe('Hello\nWorld\t"quoted"');
  });
});
