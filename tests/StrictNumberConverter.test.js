import { describe, it, expect } from 'vitest';
import { StrictNumberConverter } from '../src/classes/StrictNumberConverter.js';

describe('StrictNumberConverter - convertToNumber', () => {
  it('converts valid numeric string to number', () => {
    const converter = new StrictNumberConverter('123.45');
    expect(converter.convertToNumber()).toBe(123.45);
  });

  it('sums numbers in "+" separated string', () => {
    const converter = new StrictNumberConverter('10+20+5');
    expect(converter.convertToNumber()).toBe(35);
  });

  it('returns error for string with only "+"', () => {
    const converter = new StrictNumberConverter('+');
    expect(() => converter.convertToNumber()).toThrow(
      'There is no digits in your string',
    );
  });

  it('throws error for unsupported types', () => {
    const converter = new StrictNumberConverter(true);
    expect(() => converter.convertToNumber()).toThrow();
  });

  it('converts object to number', () => {
    const nestedObj = {
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
    const converter = new StrictNumberConverter(nestedObj);
    expect(converter.convertToNumber()).toBe(1025310100645.568);
  });
});

describe('StrictNumberConverter - convertToSum', () => {
  it('returns number as is', () => {
    const converter = new StrictNumberConverter(42);
    expect(converter.convertToSum()).toBe(42);
  });

  it('sums valid string', () => {
    const converter = new StrictNumberConverter('50+50');
    expect(converter.convertToSum()).toBe(100);
  });

  it('throws on invalid string', () => {
    const converter = new StrictNumberConverter('abc');
    expect(() => converter.convertToSum()).toThrow(
      'There is no digits in your string',
    );
  });

  it('throws on null object', () => {
    const converter = new StrictNumberConverter(null);
    expect(() => converter.convertToSum()).toThrow('Empty object or array');
  });
  it('returns error for string with only "+"', () => {
    const converter = new StrictNumberConverter('+');
    expect(() => converter.convertToSum()).toThrow(
      'There is no digits in your string',
    );
  });
  it('sums nested object values correctly', () => {
    const input = {
      a: 10,
      b: '20',
      c: '1+1+1',
      d: { e: '3.5', f: 2 },
    };
    const converter = new StrictNumberConverter(input);
    expect(converter.convertToSum()).toBeCloseTo(38.5);
  });
});

// describe('StrictNumberConverter - convertToSum (integration tests)', () => {
//   it('sums nested object values correctly', () => {
//     const input = {
//       a: 10,
//       b: '20',
//       c: '1+1+1',
//       d: { e: '3.5', f: 2 },
//     };
//     const converter = new StrictNumberConverter(input);
//     expect(converter.convertToSum()).toBeCloseTo(38.5);
//   });

//   it('handles deeply nested mixed structure', () => {
//     const input = {
//       level1: {
//         level2: {
//           a: '5+5',
//           b: 10,
//           level3: {
//             c: '2',
//             d: 'abc', // should be ignored
//             e: 1,
//           },
//         },
//       },
//       x: '1.5',
//       y: 3,
//     };
//     const converter = new StrictNumberConverter(input);
//     expect(converter.convertToSum()).toBeCloseTo(37.5);
//   });
// });
