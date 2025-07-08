import { StrictNumberConverter } from './StrictNumberConverter.js';
import error from '../helpers/errors.js';

export class AddValues {
  #firstValue;
  #secondValue;
  #firstValueType;
  #secondValueType;

  constructor(firstValue, secondValue) {
    this.#firstValue = firstValue;
    this.#secondValue = secondValue;
    this.#firstValueType = this.#getType(firstValue);
    this.#secondValueType = this.#getType(secondValue);
  }

  #getType(value) {
    if (Array.isArray(value)) return 'array';
    if (value === null) return 'null';
    return typeof value;
  }

  #add() {
    const typePair = `${this.#firstValueType}-${this.#secondValueType}`;
    switch (typePair) {
      case 'number-number':
        return this.#firstValue + this.#secondValue;
      case 'string-string':
      case 'number-string':
      case 'string-number':
        try {
          return (
            new StrictNumberConverter(this.#firstValue).convertToNumber() +
            new StrictNumberConverter(this.#secondValue).convertToNumber()
          );
        } catch (err) {
          if (err.message.includes('There is no digits in your string')) {
            return String(this.#firstValue) + String(this.#secondValue);
          }
          if (err.message.includes('NaN')) {
            error('Addition not supported for NaN');
          }
          error(err.message);
        }
        break;
      case 'array-array':
        return this.#firstValue.concat(this.#secondValue);
      case 'object-object':
        // Exclude arrays and nulls
        return { ...this.#firstValue, ...this.#secondValue };
      default:
        throw new Error(
          `Addition not supported for types: ${this.#firstValueType} + ${
            this.#secondValueType
          }`,
        );
    }
  }

  add() {
    return this.#add();
  }
}
