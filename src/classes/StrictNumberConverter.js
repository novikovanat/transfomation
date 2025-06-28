import { DIGITS_DOT_PLUS, DOT } from '../consts.js';

export class StrictNumberConverter {
  constructor(value) {
    this.value = value;
    this.type = typeof this.value;
  }

  #parseAndSum(stringValue) {
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
          case 'string':
            if (this.#parseAndSum(value)) {
              sumArray.push(this.#parseAndSum(value));
              break;
            }
            break;
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
    return flattingObj(this.value);
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
    switch (this.type) {
      case 'string':
        if (!this.#parseAndSum(this.value)) {
          throw Error('There is no digits in your string');
        }
        return this.#parseAndSum(this.value);
      case 'object':
        if (!this.value) {
          throw Error('Empty object or array');
        }
        return this.#convertObjectToNumber();
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

const mixedObj = {
  a: '10.5.25',
  b: '5.2.1+3.1.4',
  c: {
    d: '7.8.9',
    e: '2.0.0+1.5.5',
  },
};
const convertedValue = new StrictNumberConverter(mixedObj);

try {
  console.log(convertedValue.convertToSum());
  console.log(convertedValue.convertToNumber());
} catch (error) {
  console.log(error);
}

console.log(parseFloat('10.5.25'));
