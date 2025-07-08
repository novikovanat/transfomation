import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CoerceToType } from '../src/classes/coerceToType.js';
import { StringifyValue } from '../src/classes/stringifyValue.js';
import { StrictNumberConverter } from '../src/classes/strictNumberConverter.js';

describe('CoerceToType - Top-Down Integration Tests', () => {
  let consoleSpy;

  beforeEach(() => {
    // Spy on console.log to capture output for object coercion
    consoleSpy = vi
      .spyOn(globalThis.console, 'log')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('Integration with StringifyValue Class', () => {
    describe('String Coercion Integration', () => {
      it('should use StringifyValue for string coercion of primitive types', () => {
        // Test that CoerceToType delegates to StringifyValue for string conversion
        const testCases = [
          { input: 42, expected: '42' },
          { input: true, expected: 'true' },
          { input: false, expected: 'false' },
          { input: BigInt(123), expected: '123' },
          { input: null, expected: 'null' },
          { input: undefined, expected: 'undefined' },
        ];

        testCases.forEach(({ input, expected }) => {
          // Direct StringifyValue usage
          const stringifyResult = new StringifyValue(input).toString();

          // CoerceToType usage
          const coerceResult = new CoerceToType(input, 'string').coerce();

          // Both should produce the same result
          expect(coerceResult).toBe(expected);
          expect(stringifyResult).toBe(expected);
          expect(coerceResult).toBe(stringifyResult);
        });
      });

      it('should use StringifyValue for string coercion of complex types', () => {
        const complexObject = {
          name: 'John',
          age: 30,
          isActive: true,
          scores: [85, 90, 78],
          metadata: {
            department: 'Engineering',
            level: 'Senior',
          },
        };

        const array = [1, 'two', true, { key: 'value' }];

        // Test object stringification
        const stringifyObjResult = new StringifyValue(complexObject).toString();
        const coerceObjResult = new CoerceToType(
          complexObject,
          'string',
        ).coerce();
        expect(coerceObjResult).toBe(stringifyObjResult);

        // Test array stringification
        const stringifyArrResult = new StringifyValue(array).toString();
        const coerceArrResult = new CoerceToType(array, 'string').coerce();
        expect(coerceArrResult).toBe(stringifyArrResult);
      });

      it('should handle edge cases consistently between StringifyValue and CoerceToType', () => {
        const edgeCases = [
          '', // empty string
          '   ', // whitespace only
          '0', // zero string
          'false', // boolean-like string
          'null', // null-like string
          'undefined', // undefined-like string
          Symbol('test'), // symbol
          () => 'function', // function
          new Date('2023-01-01'), // date object
          new Error('test error'), // error object
          new Map([['key', 'value']]), // map
          new Set([1, 2, 3]), // set
          new ArrayBuffer(8), // array buffer
          new Uint8Array([1, 2, 3]), // typed array
        ];

        edgeCases.forEach((input) => {
          try {
            const stringifyResult = new StringifyValue(input).toString();
            const coerceResult = new CoerceToType(input, 'string').coerce();
            expect(coerceResult).toBe(stringifyResult);
          } catch {
            // If StringifyValue throws, CoerceToType should also throw
            expect(() => new CoerceToType(input, 'string').coerce()).toThrow();
          }
        });
      });
    });
  });

  describe('Integration with StrictNumberConverter Class', () => {
    describe('Number Coercion Integration', () => {
      it('should use StrictNumberConverter for number coercion of valid inputs', () => {
        const validNumberCases = [
          { input: '123.45', expected: 123.45 },
          { input: '10+20+5', expected: 35 },
          { input: '0', expected: 0 },
          { input: '-42.5', expected: -42.5 },
          { input: '1e3', expected: 1000 },
          { input: '10', expected: 10 },
          { input: '10+20', expected: 30 },
          { input: '10+20+5+10+5+10', expected: 60 },
          { input: '10.5.25', expected: 10.525 }, // multiple dots
          { input: '5.2.1+3.1.4', expected: 8.35 }, // multiple dots with addition
          { input: '123abc', expected: 123 },
          { input: 'abc123', expected: 123 },
        ];

        validNumberCases.forEach(({ input, expected }) => {
          // Direct StrictNumberConverter usage
          const converterResult = new StrictNumberConverter(
            input,
          ).convertToNumber();

          // CoerceToType usage
          const coerceResult = new CoerceToType(input, 'number').coerce();

          // Both should produce the same result
          expect(coerceResult).toBe(expected);
          expect(converterResult).toBe(expected);
          expect(coerceResult).toBe(converterResult);
        });
      });

      it('should handle invalid number inputs consistently', () => {
        const invalidNumberCases = [
          'abc',
          'true',
          'false',
          'null',
          'undefined',
          '',
          '   ',
          '+',
          '++',
          'abc+def',
        ];

        invalidNumberCases.forEach((input) => {
          // Both should throw errors for invalid inputs
          expect(() =>
            new StrictNumberConverter(input).convertToNumber(),
          ).toThrow();
          expect(() => new CoerceToType(input, 'number').coerce()).toThrow();
        });
      });

      it('should handle complex object number conversion consistently', () => {
        const complexObject = {
          a: 10,
          b: '20+5',
          c: {
            d: 'abc', // invalid string
            e: 3,
            f: {
              g: '7.5+2.5',
              h: {
                i: 100,
                j: 'xyz', // invalid string
                k: {
                  l: '1+2+3',
                  m: 4,
                  n: {
                    o: '5.5',
                    p: 'not a number', // invalid string
                    q: 6,
                  },
                },
              },
            },
          },
          r: '8',
        };

        // Both should produce the same result for complex objects
        const converterResult = new StrictNumberConverter(
          complexObject,
        ).convertToNumber();
        const coerceResult = new CoerceToType(complexObject, 'number').coerce();
        expect(coerceResult).toBe(converterResult);
      });
    });
  });

  describe('Top-Down Integration Scenarios', () => {
    describe('End-to-End Data Transformation Pipeline', () => {
      it('should handle complete data transformation pipeline', () => {
        const originalData = {
          user: {
            id: 1,
            name: 'John Doe',
            isActive: true,
            scores: [85, 90, 78],
            metadata: {
              department: 'Engineering',
              level: 'Senior',
              salary: '75000+5000',
            },
          },
          settings: {
            theme: 'dark',
            notifications: false,
            preferences: {
              language: 'en',
              timezone: 'UTC',
              currency: 'USD',
            },
          },
        };

        // Test string transformation pipeline
        const stringResult = new CoerceToType(originalData, 'string').coerce();
        expect(typeof stringResult).toBe('string');
        expect(stringResult).toBe(new StringifyValue(originalData).toString());

        // Test array transformation pipeline
        const arrayResult = new CoerceToType(originalData, 'array').coerce();
        expect(Array.isArray(arrayResult)).toBe(true);
        expect(arrayResult.every((i) => typeof i === 'object')).toBe(true);
      });

      it('should handle mixed data types in transformation pipeline', () => {
        const mixedData = [
          'hello',
          42,
          true,
          BigInt(123),
          { key: 'value' },
          [1, 2, 3],
          null,
          undefined,
          Symbol('test'),
        ];

        // Test each element can be transformed to string
        mixedData.forEach((item) => {
          const stringResult = new CoerceToType(item, 'string').coerce();
          expect(typeof stringResult).toBe('string');
          expect(stringResult).toBe(new StringifyValue(item).toString());
        });

        // Test numeric elements can be transformed to number
        const numericElements = [42, '123.45', '10+20'];
        numericElements.forEach((item) => {
          const numberResult = new CoerceToType(item, 'number').coerce();
          expect(typeof numberResult).toBe('number');
          expect(numberResult).toBe(
            new StrictNumberConverter(item).convertToNumber(),
          );
        });
      });
    });

    describe('Error Propagation Integration', () => {
      it('should propagate errors consistently through the integration chain', () => {
        const errorCases = [
          {
            input: 'invalid',
            targetType: 'number',
            expectedError: 'There is no digits in your string',
          },
          {
            input: 'maybe',
            targetType: 'boolean',
            expectedError: "Value must be 'true' or 'false'",
          },
          {
            input: 42.5,
            targetType: 'bigint',
            expectedError: 'Value must be an integer',
          },
          {
            input: 'abc',
            targetType: 'bigint',
            expectedError: 'String must start with a digits',
          },
          {
            input: null,
            targetType: 'object',
            expectedError: 'Cannot coerce null to object',
          },
          {
            input: undefined,
            targetType: 'object',
            expectedError: 'Cannot coerce type undefined to object',
          },
        ];

        errorCases.forEach(({ input, targetType, expectedError }) => {
          expect(() => new CoerceToType(input, targetType).coerce()).toThrow(
            expectedError,
          );
        });
      });

      it('should handle nested error scenarios in complex objects', () => {
        const complexObjectWithErrors = {
          valid: 42,
          invalidString: 'abc',
          nested: {
            valid: '10+20',
            invalid: 'xyz',
            deeper: {
              valid: 100,
              invalid: 'not-a-number',
            },
          },
        };

        // Only valid numbers should be included: 42, 10 +20, 100
        // invalidString, invalid, and deeper.invalid should be ignored
        const expected = 4230100;

        const coerceResult = new CoerceToType(
          complexObjectWithErrors,
          'number',
        ).coerce();
        const converterResult = new StrictNumberConverter(
          complexObjectWithErrors,
        ).convertToNumber();

        expect(coerceResult).toBe(expected);
        expect(converterResult).toBe(expected);
      });
    });

    describe('Performance Integration Tests', () => {
      it('should handle large datasets efficiently through the integration chain', () => {
        const largeDataset = {
          users: Array.from({ length: 1000 }, (_, i) => ({
            id: i,
            name: `User${i}`,
            score: `${i * 10}+${i * 5}`,
            isActive: i % 2 === 0,
          })),
          metadata: {
            totalUsers: 1000,
            averageScore: '5000+2500',
            settings: {
              theme: 'dark',
              notifications: true,
            },
          },
        };

        // Test string transformation performance
        const startTime = globalThis.performance.now();
        const stringResult = new CoerceToType(largeDataset, 'string').coerce();
        const endTime = globalThis.performance.now();

        expect(typeof stringResult).toBe('string');
        expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second

        // Test array transformation performance
        const arrayStartTime = globalThis.performance.now();
        const arrayResult = new CoerceToType(largeDataset, 'array').coerce();
        const arrayEndTime = globalThis.performance.now();

        expect(Array.isArray(arrayResult)).toBe(true);
        expect(arrayEndTime - arrayStartTime).toBeLessThan(1000); // Should complete within 1 second
      });

      it('should maintain memory efficiency during large transformations', () => {
        const memoryIntensiveData = {
          largeString: 'a'.repeat(100000),
          largeArray: Array.from({ length: 10000 }, (_, i) => i),
          nestedObjects: Array.from({ length: 1000 }, (_, i) => ({
            id: i,
            data: `data${i}`,
            nested: {
              value: i * 2,
              text: `text${i}`,
            },
          })),
        };

        // Test that transformations don't cause memory issues
        expect(() => {
          new CoerceToType(memoryIntensiveData, 'string').coerce();
          new CoerceToType(memoryIntensiveData, 'array').coerce();
        }).not.toThrow();
      });
    });
  });

  describe('Cross-Class Method Integration', () => {
    it('should verify consistent behavior between direct class usage and CoerceToType', () => {
      const testCases = [
        // String coercion test cases
        {
          value: 42,
          targetType: 'string',
          directClass: StringifyValue,
          directMethod: 'toString',
        },
        {
          value: true,
          targetType: 'string',
          directClass: StringifyValue,
          directMethod: 'toString',
        },
        {
          value: { key: 'value' },
          targetType: 'string',
          directClass: StringifyValue,
          directMethod: 'toString',
        },

        // Number coercion test cases
        {
          value: '123.45',
          targetType: 'number',
          directClass: StrictNumberConverter,
          directMethod: 'convertToNumber',
        },
        {
          value: '10+20+5',
          targetType: 'number',
          directClass: StrictNumberConverter,
          directMethod: 'convertToNumber',
        },
        {
          value: { a: 10, b: '20+5' },
          targetType: 'number',
          directClass: StrictNumberConverter,
          directMethod: 'convertToNumber',
        },
      ];

      testCases.forEach(({ value, targetType, directClass, directMethod }) => {
        try {
          // Direct class usage
          const directInstance = new directClass(value);
          const directResult = directInstance[directMethod]();

          // CoerceToType usage
          const coerceResult = new CoerceToType(value, targetType).coerce();

          // Results should be identical
          expect(coerceResult).toBe(directResult);
        } catch {
          // If direct usage throws, CoerceToType should also throw
          expect(() => new CoerceToType(value, targetType).coerce()).toThrow();
        }
      });
    });

    it('should verify error handling consistency across all integration points', () => {
      const errorTestCases = [
        // StringifyValue error cases
        { value: undefined, targetType: 'string', shouldThrow: false }, // StringifyValue handles undefined
        { value: null, targetType: 'string', shouldThrow: false }, // StringifyValue handles null

        // StrictNumberConverter error cases
        { value: 'abc', targetType: 'number', shouldThrow: true },
        { value: true, targetType: 'number', shouldThrow: true },
        // { value: {}, targetType: 'number', shouldThrow: true },

        // CoerceToType specific error cases
        { value: 'maybe', targetType: 'boolean', shouldThrow: true },
        { value: 42.5, targetType: 'bigint', shouldThrow: true },
        { value: null, targetType: 'object', shouldThrow: true },
      ];

      errorTestCases.forEach(({ value, targetType, shouldThrow }) => {
        if (shouldThrow) {
          expect(() => new CoerceToType(value, targetType).coerce()).toThrow();
        } else {
          expect(() =>
            new CoerceToType(value, targetType).coerce(),
          ).not.toThrow();
        }
      });
    });
  });
});
