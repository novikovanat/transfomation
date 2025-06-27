import { DIGITS_AND_DOT } from '../consts.js';

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
    const index = isValidString.indexOf('+');
    if (index === -1) {
      return parseFloat(isValidString);
    }
    if (index === 0) {
      if (isValidString.length < 2) {
        return;
      } else {
        isValidString = isValidString.slice(1);
      }
    }
    const addends = isValidString.split('+');
    let stringSum = 0;
    for (let i = 0; i < addends.length; i++) {
      stringSum += parseFloat(addends[i]);
    }
    return stringSum;
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
        if (!this.#parseAndSum(this.value)) {
          throw Error('There is no digits in your string');
        }
        return this.#parseAndSum(this.value);
      case 'object':
        return this.#parseAndSum(this.value.toString());
      case 'number':
        return this.value;
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

let foo = '+';
const convertedValue = new StrictNumberConverter(foo);

try {
  console.log(convertedValue.convertToSum());
  console.log(convertedValue.convertToNumber());
} catch (error) {
  console.log(error);
}
