import {
  BINARY_NUMBER,
  DIGITS_DOT_PLUS,
  DOT,
  EXPONENTIAL_NUMBER,
  HEXADECIMAL_NUMBER,
  OCTAL_NUMBER,
} from '../consts.js';

export class StrictNumberConverter {
  #value;
  #type;
  constructor(value) {
    this.#value = value;
    this.#type = typeof this.#value;
  }

  #parseAndSum(stringValue) {
    if (
      EXPONENTIAL_NUMBER.test(stringValue) ||
      BINARY_NUMBER.test(stringValue) ||
      OCTAL_NUMBER.test(stringValue) ||
      HEXADECIMAL_NUMBER.test(stringValue)
    ) {
      return Number(stringValue);
    }
    let cleand = stringValue.replaceAll(DIGITS_DOT_PLUS, '');
    if (!cleand) {
      return;
    }
    const dotIndex = cleand.indexOf('.');

    const plusIndex = cleand.indexOf('+');
    if (plusIndex === -1) {
      if (dotIndex > -1) {
        cleand =
          cleand.substr(0, dotIndex + 1) +
          cleand.slice(dotIndex).replace(DOT, '');
      }
      return parseFloat(cleand);
    }
    if (plusIndex === 0) {
      if (cleand.length < 2) {
        return;
      } else {
        cleand = cleand.slice(1);
      }
    }
    if (plusIndex === cleand.length - 1) {
      cleand = cleand.slice(0, -1);
    }
    const addends = cleand.split('+');
    let stringSum = 0;
    for (let i = 0; i < addends.length; i++) {
      const dotIndexAddend = addends[i].indexOf('.');
      if (dotIndexAddend > -1) {
        addends[i] =
          addends[i].substr(0, dotIndexAddend + 1) +
          addends[i].slice(dotIndexAddend).replace(DOT, '');
      }

      stringSum += parseFloat(addends[i]);
    }
    return stringSum;
  }

  #convertToFlatObject() {
    let sumArray = [];
    const flattingObj = (object) => {
      for (let element in object) {
        const value = object[element];

        switch (typeof value) {
          case 'number':
            sumArray.push(value);
            break;
          case 'string': {
            const parsedValue = this.#parseAndSum(value);
            if (parsedValue) {
              sumArray.push(parsedValue);
            }
            break;
          }
          case 'object':
            if (!value) {
              break;
            }
            flattingObj(value);
            break;
        }
      }
      return sumArray;
    };
    return flattingObj(this.#value);
  }

  #convertObjectToSum() {
    const flatArray = this.#convertToFlatObject();
    return flatArray.reduce((acc, val) => acc + val, 0);
  }

  #convertObjectToNumber() {
    const flatArray = this.#convertToFlatObject();
    let concatenated = flatArray.join('');
    const dotIndex = concatenated.indexOf('.');
    if (dotIndex > -1) {
      concatenated =
        concatenated.substring(0, dotIndex + 1) +
        concatenated.slice(dotIndex).replace(DOT, '');
    }
    return Number(concatenated);
  }

  convertToNumber() {
    switch (this.#type) {
      case 'string': {
        const parsedValue = this.#parseAndSum(this.#value);
        if (!parsedValue) {
          throw Error('There is no digits in your string');
        }
        return parsedValue;
      }
      case 'object':
        if (!this.#value) {
          throw Error('Empty object or array');
        }
        return this.#convertObjectToNumber();
      case 'number':
        return this.#value;
      default:
        throw new Error(
          `${this.#type} can't be converted by StrictNuberConvector `,
        );
    }
  }

  convertToSum() {
    switch (this.#type) {
      case 'object':
        if (!this.#value) {
          throw Error('Empty object or array');
        }
        return this.#convertObjectToSum();
      case 'number':
        return this.#value;
      case 'string': {
        const parsedValue = this.#parseAndSum(this.#value);
        if (!parsedValue) {
          throw Error('There is no digits in your string');
        }
        return parsedValue;
      }
      default:
        throw new Error(
          `${this.#type} can't be converted by StrictNuberConvector `,
        );
    }
  }
}
