import { describe, it, expect, vi, afterEach } from 'vitest';
import { StrictNumberConverter } from '../src/classes/StrictNumberConverter.js';
import { AddValues } from '../src/classes/addValues.js';
import error from '../src/helpers/errors.js';

// Top-down: stub dependencies before importing AddValues
vi.mock('../src/classes/StrictNumberConverter.js', () => ({
  StrictNumberConverter: class {
    constructor(val) {
      this.val = val;
    }
    convertToNumber() {
      if (this.val === 'fail') throw new Error('Stub error');
      if (this.val === 'nodigits')
        throw new Error('There is no digits in your string');
      if (typeof this.val === 'number' && isNaN(this.val))
        throw new Error('NaN');
      return Number(this.val);
    }
  },
}));
vi.mock('../src/helpers/errors.js', () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe('AddValues Top-Down Integration', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should verify correct fallback and error handling', () => {
    const testCases = [
      // Valid number-like strings
      { a: '123', b: '456', expect: 579 },
      { a: '10', b: 20, expect: 30 },
      { a: 10, b: '20', expect: 30 },
      { a: '1.5', b: '2.5', expect: 4 },
      // Fallback to string concat if not number-like
      { a: 'nodigits', b: '123', expect: 'nodigits123' },
      { a: '123', b: 'nodigits', expect: '123nodigits' },
      // Error case: StrictNumberConverter throws and AddValues calls error helper
      { a: 'fail', b: 'fail', expectError: 'Stub error' },
      // NaN case: both should error
      { a: NaN, b: 'fail', expectError: 'Addition not supported for NaN' },
      { a: NaN, b: 1, expectError: 'Addition not supported for NaN' },
    ];

    testCases.forEach(({ a, b, expect: expected, expectError }) => {
      // Try direct StrictNumberConverter usage
      let directResult;
      try {
        const aNum = new StrictNumberConverter(a).convertToNumber();
        const bNum = new StrictNumberConverter(b).convertToNumber();
        directResult = aNum + bNum;
      } catch {
        // directResult remains undefined
      }

      // AddValues usage
      let addValuesResult;
      try {
        addValuesResult = new AddValues(a, b).add();
      } catch {
        // addValuesResult remains undefined
      }

      if (expectError) {
        // For error cases, expect AddValues to call the error helper with the correct message
        expect(error).toHaveBeenCalled();
        expect(error).toHaveBeenCalledWith(expectError);
      } else if (typeof directResult === 'number' && !isNaN(directResult)) {
        expect(addValuesResult).toBe(directResult);
      } else {
        expect(addValuesResult).toBe(expected);
      }
    });
  });

  it('calls error helper if StrictNumberConverter throws an unexpected error', () => {
    new AddValues('fail', 'fail').add();
    expect(error).toHaveBeenCalledWith('Stub error');
  });
});
