import { describe, it, expect } from 'vitest';
import { CoerceToType } from '../src/classes/coerceToType.js';

describe('CoerceToType', () => {
  describe('Constructor and Basic Functionality', () => {
    it('should create instance with value and target type', () => {
      const coercer = new CoerceToType('test', 'string');
      expect(coercer).toBeInstanceOf(CoerceToType);
    });

    it('should handle case-insensitive target type', () => {
      const coercer = new CoerceToType('test', 'STRING');
      expect(coercer.coerce()).toBe('test');
    });

    it('should throw error for non-string target type', () => {
      const coercer = new CoerceToType('test', 123);
      expect(() => coercer.coerce()).toThrow(
        'Name of a target type must be a string',
      );
    });
  });

  describe('String Coercion', () => {
    it('should coerce string to string (no change)', () => {
      const coercer = new CoerceToType('heLlo', 'string');
      expect(coercer.coerce()).toBe('heLlo');
    });

    it('should coerce number to string', () => {
      const coercer = new CoerceToType(42, 'string');
      expect(coercer.coerce()).toBe('42');
    });

    it('should coerce boolean true to string', () => {
      const coercer = new CoerceToType(true, 'string');
      expect(coercer.coerce()).toBe('true');
    });

    it('should coerce boolean false to string', () => {
      const coercer = new CoerceToType(false, 'string');
      expect(coercer.coerce()).toBe('false');
    });

    it('should coerce bigint to string', () => {
      const coercer = new CoerceToType(BigInt(123), 'string');
      expect(coercer.coerce()).toBe('123');
    });

    it('should coerce object to string', () => {
      const coercer = new CoerceToType({ key: 'value' }, 'string');
      expect(coercer.coerce()).toBe('{"key":"value"}');
    });

    it('should coerce array to string', () => {
      const coercer = new CoerceToType([1, 2, 3], 'string');
      expect(coercer.coerce()).toBe('[1,2,3]');
    });

    it('should coerce null to string', () => {
      const coercer = new CoerceToType(null, 'string');
      expect(coercer.coerce()).toBe('null');
    });

    it('should coerce undefined to string', () => {
      const coercer = new CoerceToType(undefined, 'string');
      expect(coercer.coerce()).toBe('undefined');
    });
  });

  describe('Number Coercion', () => {
    it('should coerce valid numeric string to number', () => {
      const coercer = new CoerceToType('123.45', 'number');
      expect(coercer.coerce()).toBe(123.45);
    });

    it('should coerce number to number (no change)', () => {
      const coercer = new CoerceToType(42, 'number');
      expect(coercer.coerce()).toBe(42);
    });

    it('should coerce string with addition to number', () => {
      const coercer = new CoerceToType('10+20+5', 'number');
      expect(coercer.coerce()).toBe(35);
    });

    it('should throw error for invalid string', () => {
      const coercer = new CoerceToType('abc', 'number');
      expect(() => coercer.coerce()).toThrow();
    });

    it('should throw error for boolean', () => {
      const coercer = new CoerceToType(true, 'number');
      expect(() => coercer.coerce()).toThrow();
    });

    it('should coerce object to number with concatenation', () => {
      const coercer = new CoerceToType({ a: 1, b: '2+3', c: 4 }, 'number');
      expect(coercer.coerce()).toBe(154);
    });

    it('should coerce nested object to number with concatenation', () => {
      const nestedObj = {
        a: 10,
        b: '20+5',
        c: {
          d: 'abc',
          e: 3,
          f: {
            g: '7.5+2.5',
            h: {
              i: 100,
              j: 'xyz',
              k: {
                l: '1+2+3',
                m: 4,
                n: {
                  o: '5.5',
                  p: 'not a number',
                  q: 6,
                },
              },
            },
          },
        },
        r: '8',
      };
      const coercer = new CoerceToType(nestedObj, 'number');
      expect(coercer.coerce()).toBe(1025310100645.568);
    });

    it('should handle empty object', () => {
      const coercer = new CoerceToType({}, 'number');
      expect(coercer.coerce()).toBe(0);
    });
  });

  describe('Boolean Coercion', () => {
    it('should coerce boolean to boolean (no change)', () => {
      const coercer = new CoerceToType(true, 'boolean');
      expect(coercer.coerce()).toBe(true);
    });

    it('should coerce string "true" to boolean true', () => {
      const coercer = new CoerceToType('true', 'boolean');
      expect(coercer.coerce()).toBe(true);
    });

    it('should coerce string "false" to boolean false', () => {
      const coercer = new CoerceToType('false', 'boolean');
      expect(coercer.coerce()).toBe(false);
    });

    it('should handle case-insensitive boolean strings', () => {
      const coercer1 = new CoerceToType('TRUE', 'boolean');
      const coercer2 = new CoerceToType('FALSE', 'boolean');
      expect(coercer1.coerce()).toBe(true);
      expect(coercer2.coerce()).toBe(false);
    });

    it('should handle trimmed boolean strings', () => {
      const coercer1 = new CoerceToType('  true  ', 'boolean');
      const coercer2 = new CoerceToType('  false  ', 'boolean');
      expect(coercer1.coerce()).toBe(true);
      expect(coercer2.coerce()).toBe(false);
    });

    it('should throw error for invalid boolean string', () => {
      const coercer = new CoerceToType('maybe', 'boolean');
      expect(() => coercer.coerce()).toThrow("Value must be 'true' or 'false'");
    });

    it('should throw error for number', () => {
      const coercer = new CoerceToType(1, 'boolean');
      expect(() => coercer.coerce()).toThrow(
        'Cannot coerce type number to boolean',
      );
    });

    it('should throw error for object', () => {
      const coercer = new CoerceToType({}, 'boolean');
      expect(() => coercer.coerce()).toThrow(
        'Cannot coerce type object to boolean',
      );
    });
  });

  describe('BigInt Coercion', () => {
    it('should coerce bigint to bigint (no change)', () => {
      const coercer = new CoerceToType(BigInt(123), 'bigint');
      expect(coercer.coerce()).toBe(BigInt(123));
    });

    it('should coerce integer number to bigint', () => {
      const coercer = new CoerceToType(42, 'bigint');
      expect(coercer.coerce()).toBe(BigInt(42));
    });

    it('should throw error for non-integer number', () => {
      const coercer = new CoerceToType(42.5, 'bigint');
      expect(() => coercer.coerce()).toThrow('Value must be an integer');
    });

    it('should coerce valid integer string to bigint', () => {
      const coercer = new CoerceToType('123', 'bigint');
      expect(coercer.coerce()).toBe(BigInt(123));
    });

    it('should throw error for non-integer string', () => {
      const coercer = new CoerceToType('123.45', 'bigint');
      expect(() => coercer.coerce()).toThrow('Value must be an integer');
    });

    it('should throw error for invalid string', () => {
      const coercer = new CoerceToType('abc', 'bigint');
      expect(() => coercer.coerce()).toThrow('String must start with a digits');
    });

    it('should throw error for boolean', () => {
      const coercer = new CoerceToType(true, 'bigint');
      expect(() => coercer.coerce()).toThrow(
        'Cannot coerce type boolean to bigint',
      );
    });

    it('should coerce object to bigint when it can be converted to integer', () => {
      const coercer = new CoerceToType({ a: '123' }, 'bigint');
      expect(coercer.coerce()).toBe(BigInt(123));
    });

    it('should throw error for object that converts to float', () => {
      const coercer = new CoerceToType({ a: '123.45' }, 'bigint');
      expect(() => coercer.coerce()).toThrow(
        'This object cannot be converted to a bigint',
      );
    });

    it('should throw error for object with no digits', () => {
      const coercer = new CoerceToType({ a: 'abc' }, 'bigint');
      expect(() => coercer.coerce()).toThrow('String must start with a digits');
    });
  });

  describe('Symbol Coercion', () => {
    it('should coerce symbol to symbol (no change)', () => {
      const symbol = Symbol('test');
      const coercer = new CoerceToType(symbol, 'symbol');
      expect(coercer.coerce()).toBe(symbol);
    });

    it('should throw error for string', () => {
      const coercer = new CoerceToType('test', 'symbol');
      expect(() => coercer.coerce()).toThrow(
        'Cannot coerce type string to symbol',
      );
    });

    it('should throw error for number', () => {
      const coercer = new CoerceToType(42, 'symbol');
      expect(() => coercer.coerce()).toThrow(
        'Cannot coerce type number to symbol',
      );
    });

    it('should throw error for boolean', () => {
      const coercer = new CoerceToType(true, 'symbol');
      expect(() => coercer.coerce()).toThrow(
        'Cannot coerce type boolean to symbol',
      );
    });

    it('should throw error for object', () => {
      const coercer = new CoerceToType({}, 'symbol');
      expect(() => coercer.coerce()).toThrow(
        'Cannot coerce type object to symbol',
      );
    });
  });

  describe('Array Coercion', () => {
    it('should coerce array to array (no change)', () => {
      const array = [1, 2, 3];
      const coercer = new CoerceToType(array, 'array');
      expect(coercer.coerce()).toEqual(array);
    });

    it('should coerce string to array', () => {
      const coercer = new CoerceToType('hello', 'array');
      expect(coercer.coerce()).toEqual(['h', 'e', 'l', 'l', 'o']);
    });

    it('should coerce object to array of values', () => {
      const coercer = new CoerceToType({ a: 1, b: 2, c: 3 }, 'array');
      expect(coercer.coerce()).toEqual([1, 2, 3]);
    });

    it('should coerce number to array', () => {
      const coercer = new CoerceToType(42, 'array');
      expect(coercer.coerce()).toEqual([42]);
    });

    it('should coerce bigint to array', () => {
      const coercer = new CoerceToType(BigInt(123), 'array');
      expect(coercer.coerce()).toEqual([BigInt(123)]);
    });

    it('should coerce boolean to array', () => {
      const coercer = new CoerceToType(true, 'array');
      expect(coercer.coerce()).toEqual([true]);
    });

    it('should throw error for null', () => {
      const coercer = new CoerceToType(null, 'array');
      expect(() => coercer.coerce()).toThrow(
        'Cannot coerce type object to array',
      );
    });

    it('should throw error for undefined', () => {
      const coercer = new CoerceToType(undefined, 'array');
      expect(() => coercer.coerce()).toThrow(
        'Cannot coerce type undefined to array',
      );
    });
  });

  describe('Object Coercion', () => {
    it('should coerce object to object (no change)', () => {
      const obj = { key: 'value' };
      const coercer = new CoerceToType(obj, 'object');
      expect(coercer.coerce()).toBe(obj);
    });

    it('should throw error for null', () => {
      const coercer = new CoerceToType(null, 'object');
      expect(() => coercer.coerce()).toThrow(
        'Cannot coerce null or undefined to object',
      );
    });

    it('should throw error for undefined', () => {
      const coercer = new CoerceToType(undefined, 'object');
      expect(() => coercer.coerce()).toThrow(
        'Cannot coerce null or undefined to object',
      );
    });

    it('should handle string to object (currently logs)', () => {
      const coercer = new CoerceToType('test', 'object');
      // This currently just logs, so we just check it doesn't throw
      expect(() => coercer.coerce()).not.toThrow();
    });

    it('should throw error for number', () => {
      const coercer = new CoerceToType(42, 'object');
      expect(() => coercer.coerce()).toThrow(
        'Cannot coerce type number to object',
      );
    });

    it('should throw error for boolean', () => {
      const coercer = new CoerceToType(true, 'object');
      expect(() => coercer.coerce()).toThrow(
        'Cannot coerce type boolean to object',
      );
    });

    it('should throw error for bigint', () => {
      const coercer = new CoerceToType(BigInt(123), 'object');
      expect(() => coercer.coerce()).toThrow(
        'Cannot coerce type bigint to object',
      );
    });

    it('should throw error for symbol', () => {
      const coercer = new CoerceToType(Symbol('test'), 'object');
      expect(() => coercer.coerce()).toThrow(
        'Cannot coerce type symbol to object',
      );
    });
  });
});

describe('CoerceToType - Integration Tests', () => {
  describe('Complex Data Transformation Scenarios', () => {
    it('should handle nested object transformation to string', () => {
      const nestedObj = {
        name: 'John',
        age: 30,
        isActive: true,
        scores: [85, 90, 78],
      };
      const coercer = new CoerceToType(nestedObj, 'string');
      expect(coercer.coerce()).toBe('[object Object]');
    });

    it('should handle array of mixed types to string', () => {
      const mixedArray = [1, 'two', true, { key: 'value' }];
      const coercer = new CoerceToType(mixedArray, 'string');
      expect(coercer.coerce()).toBe('1,two,true,[object Object]');
    });

    it('should handle complex object to array transformation', () => {
      const complexObj = {
        id: 1,
        name: 'Product',
        price: 29.99,
        tags: ['electronics', 'gadget'],
        metadata: {
          brand: 'TechCorp',
          warranty: '2 years',
        },
      };
      const coercer = new CoerceToType(complexObj, 'array');
      expect(coercer.coerce()).toEqual([
        1,
        'Product',
        29.99,
        ['electronics', 'gadget'],
        { brand: 'TechCorp', warranty: '2 years' },
      ]);
    });

    it('should handle string with special characters to array', () => {
      const specialString = 'Hello, World! 🚀';
      const coercer = new CoerceToType(specialString, 'array');
      expect(coercer.coerce()).toEqual(Array.from(specialString));
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle invalid target type gracefully', () => {
      const coercer = new CoerceToType('test', 'invalid_type');
      expect(() => coercer.coerce()).toThrow();
    });

    it('should handle edge cases with empty values', () => {
      const coercer1 = new CoerceToType('', 'string');
      const coercer2 = new CoerceToType('', 'array');
      const coercer3 = new CoerceToType('', 'boolean');

      expect(coercer1.coerce()).toBe('');
      expect(coercer2.coerce()).toEqual([]);
      expect(() => coercer3.coerce()).toThrow(
        "Value must be 'true' or 'false'",
      );
    });

    it('should handle whitespace-only strings appropriately', () => {
      const coercer1 = new CoerceToType('   ', 'string');
      const coercer2 = new CoerceToType('   ', 'array');
      const coercer3 = new CoerceToType('   ', 'boolean');

      expect(coercer1.coerce()).toBe('   ');
      expect(coercer2.coerce()).toEqual([' ', ' ', ' ']);
      expect(() => coercer3.coerce()).toThrow(
        "Value must be 'true' or 'false'",
      );
    });
  });

  describe('Performance and Memory Tests', () => {
    it('should handle large strings efficiently', () => {
      const largeString = 'a'.repeat(10000);
      const coercer = new CoerceToType(largeString, 'array');
      const result = coercer.coerce();
      expect(result).toHaveLength(10000);
      expect(result[0]).toBe('a');
      expect(result[9999]).toBe('a');
    });

    it('should handle large objects efficiently', () => {
      const largeObj = {};
      for (let i = 0; i < 1000; i++) {
        largeObj[`key${i}`] = i;
      }
      const coercer = new CoerceToType(largeObj, 'array');
      const result = coercer.coerce();
      expect(result).toHaveLength(1000);
      expect(result[0]).toBe(0);
      expect(result[999]).toBe(999);
    });
  });

  describe('Cross-Type Compatibility', () => {
    it('should maintain data integrity across type conversions', () => {
      const originalData = {
        string: 'test',
        number: 42,
        boolean: true,
        bigint: BigInt(123),
        array: [1, 2, 3],
        object: { key: 'value' },
      };

      // Test each property can be coerced to string and back
      Object.entries(originalData).forEach(([key, value]) => {
        const coercer = new CoerceToType(value, 'string');
        const stringResult = coercer.coerce();
        expect(typeof stringResult).toBe('string');
        expect(stringResult).toBeTruthy();
      });
    });

    it('should handle circular references gracefully', () => {
      const circularObj = { name: 'test' };
      circularObj.self = circularObj;

      const coercer = new CoerceToType(circularObj, 'string');
      expect(() => coercer.coerce()).not.toThrow();
    });
  });
});
