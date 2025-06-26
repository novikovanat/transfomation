import { DIGITS_AND_DOT } from './consts';

// const coerceToType = {};

// export const invertBoolean = (value) => {
//   if (typeof value !== 'boolean') {
//     throw new Error('Invalid type');
//   }
//   return !value;
// };

// console.log(parseFloat('L'));

// export const strictConvertToNumber = (value) => {
//   const dataType = typeof value;

//   if (dataType === 'string') {
//     const isValidString = value.replaceAll(DIGITS_AND_DOT, '');
//     if (isValidString) {
//       return;
//     } else {
//       v;
//     }
//   }
// };
let x;

export class StrictNumberConverter {
  constructor(value) {
    this.value = value;
    this.type = typeof this.value;
  }

  #parseAndSum(stringValue) {
    let isValidString = stringValue.replaceAll(DIGITS_AND_DOT, '');
    if (!isValidString) {
      return;
    }
    if (!isValidString.includes('+')) {
      return parseFloat(isValidString);
    } else {
      if (isValidString[0] === '+') {
        isValidString = isValidString.slice(1);
      }
      const addends = isValidString.split('+');
      let stringSum = 0;
      for (let i = 0; i < addends.length; i++) {
        stringSum += parseFloat(addends[i]);
      }
      return stringSum;
    }
  }

  #convertObjectToSum() {
    let sum = 0;
    const flattingObj = (object) => {
      for (let element in object) {
        const value = object[element];
        switch (typeof value) {
          case 'number':
            sum += value;
            break;
          case 'string':
            if (this.#parseAndSum(value)) {
              const i = this.#parseAndSum(value);
              sum += i;
              break;
            } else {
              break;
            }
          case 'object':
            flattingObj(value);
        }
      }
      return sum;
    };
    return flattingObj(this.value);
  }

  convertToNumber() {
    switch (this.type) {
      case 'string':
        return this.#parseAndSum(this.value);
      case 'object':
        return this.#parseAndSum(this.value.toString());
      default:
        throw new Error(
          `${this.type} can't be converted by StrictNuberConvector `,
        );
    }
  }

  convertToSum() {
    switch (this.type) {
      case 'object':
        if (!this.value) {
          throw Error('Empty object or array');
        }
        return this.#convertObjectToSum();
      case 'number':
        return this.value;
      case 'string':
        if (!this.#parseAndSum(this.value)) {
          throw Error('There is no digits in your string');
        } else {
          return this.#parseAndSum(this.value);
        }
      default:
        throw new Error(
          `${this.type} can't be converted by StrictNuberConvector `,
        );
    }
  }
}

const convertedValue = new StrictNumberConverter([
  'asdfdsf+5',
  { b: 1, c: { a: 5, b: 0 } },
]);

try {
  console.log(convertedValue.convertToSum());
  console.log(convertedValue.convertToNumber());
} catch (error) {
  console.log(error);
}
