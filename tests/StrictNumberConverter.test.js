import { describe, it, expect } from 'vitest';
import { StrictNumberConverter } from '../src/classes/StrictNumberConverter.js';

describe('StrictNumberConverter - convertToNumber', () => {
  it('converts valid numeric string to number', () => {
    const converter = new StrictNumberConverter('123.45');
    expect(converter.convertToNumber()).toBe(123.45);
  });

  it('handles strings with multiple dots', () => {
    const converter = new StrictNumberConverter('10.5.25');
    // parseFloat('10.5.25') returns 10.5 (stops at first invalid character)
    expect(converter.convertToNumber()).toBe(10.525);
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

  it('handles strings with multiple dots in sum', () => {
    const converter = new StrictNumberConverter('10.5.25+5.2.1');
    // parseFloat('10.5.25') returns 10.5, parseFloat('5.2.1') returns 5.2
    // 10.5 + 5.2 = 15.7
    expect(converter.convertToSum()).toBe(15.735);
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

describe('StrictNumberConverter - nested object with mixed valid and invalid types', () => {
  const mixedObj = {
    a: 1,
    b: '2+3',
    c: 'invalid',
    d: {
      e: 4,
      f: '5',
      g: null,
      h: undefined,
      i: [6, '7', 'bad'],
      j: true,
      k: {
        l: '8+bad',
        m: 9,
      },
    },
    n: false,
    o: '10',
    p: { q: 'not a number', r: 11 },
  };

  it('convertToNumber concatenates all valid numbers in nested object', () => {
    const converter = new StrictNumberConverter(mixedObj);
    // Only valid numbers and valid string sums are concatenated: 1, 5 (from '2+3'), 4, 5, 6, 7, 8 (from '8+bad'), 9, 10, 11
    // [1, 5, 4, 5, 6, 7, 8, 9, 10, 11] => '154567891011' => 154567891011
    expect(converter.convertToNumber()).toBe(154567891011);
  });

  it('convertToSum sums all valid numbers in nested object', () => {
    const converter = new StrictNumberConverter(mixedObj);
    // 1 + 5 (from '2+3') + 4 + 5 + 6 + 7 + 8 (from '8+bad') + 9 + 10 + 11 = 66
    expect(converter.convertToSum()).toBe(66);
  });

  it('handles multiple dots in nested object strings', () => {
    const objWithMultipleDots = {
      a: '10.5.25',
      b: '5.2.1+3.1.4',
      c: {
        d: '7.8.9',
        e: '2.0.0+1.5.5',
      },
    };
    const converter = new StrictNumberConverter(objWithMultipleDots);

    // For convertToNumber: concatenate all valid numbers
    // 10.525, 8.35 (from '5.2.1+3.1.4'), 7.89 (from '7.8.9'), 3.55 (from '2.0.0+1.5.5')
    // [10.525, 8.35, 7.89, 3.55] => '10.5258.357.893.55' => 10.525835789355
    expect(converter.convertToNumber()).toBe(10.525835789355);

    // For convertToSum: sum all valid numbers
    // 10.525 + 8.35 + 7.89 + 3.55 = 30.315
    expect(converter.convertToSum()).toBe(30.315);
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
