import { StringifyValue } from './stringifyValue.js';
import { StrictNumberConverter } from './strictNumberConverter.js';
import error from '../helpers/errors.js';
export class CoerceToType {
  #value;
  #targetType;
  #valueType;
  constructor(value, targetType) {
    this.#value = value;
    this.#valueType = typeof value;
    this.#targetType = targetType;
  }
  coerce() {
    this.#setTargetType(this.#targetTypeCheck(this.#targetType));
    return this.#coerce();
  }

  #setTargetType(newTargetType) {
    this.#targetType = newTargetType;
  }

  #targetTypeCheck(targetType) {
    if (typeof targetType === 'string') {
      return targetType.toLowerCase();
    }
    error('Name of a target type must be a string');
  }

  #coerce() {
    switch (this.#targetType) {
      case 'string':
        return new StringifyValue(this.#value).toString();
      case 'number':
        return new StrictNumberConverter(this.#value).convertToNumber();
      case 'boolean':
        if (this.#valueType === 'boolean') return this.#value;
        else if (this.#valueType === 'string') {
          const v = this.#value.trim().toLowerCase();
          if (v === 'true') {
            return true;
          } else if (v === 'false') {
            return false;
          } else {
            error("Value must be 'true' or 'false'");
          }
        } else {
          error(`Cannot coerce type ${this.#valueType} to ${this.#targetType}`);
        }
        break;

      case 'bigint':
        switch (this.#valueType) {
          case 'bigint':
            return this.#value;
          case 'number':
            if (!Number.isInteger(this.#value)) {
              error('Value must be an integer');
            }
            return BigInt(this.#value);
          case 'string': {
            const v = Number.parseFloat(this.#value);
            if (isNaN(v)) {
              error('String must start with a digits');
            } else if (!Number.isInteger(v)) {
              error('Value must be an integer');
            } else {
              return BigInt(v);
            }
            break;
          }
          case 'object': {
            const number = new StrictNumberConverter(
              this.#value,
            ).convertToNumber();

            if (!Number.isInteger(number)) {
              error(`This object cannot be converted to a bigint`);
            }
            return BigInt(number);
          }
          default:
            error(
              `Cannot coerce type ${this.#valueType} to ${this.#targetType}`,
            );
        }
        break;

      case 'symbol':
        if (this.#valueType === 'symbol') {
          return this.#value;
        } else {
          error(`Cannot coerce type ${this.#valueType} to ${this.#targetType}`);
        }
        break;

      case 'array':
        if (Array.isArray(this.#value)) return this.#value;
        if (this.#valueType === 'string') return Array.from(this.#value);
        if (this.#valueType === 'object' && this.#value !== null)
          return Object.values(this.#value);
        if (
          this.#valueType === 'number' ||
          this.#valueType === 'bigint' ||
          this.#valueType === 'boolean'
        )
          return [this.#value];
        return error(
          `Cannot coerce type ${
            this.#value === null ? 'null' : this.#valueType
          } to ${this.#targetType}`,
        );

      case 'object':
        if (this.#value === null || this.#value === undefined) {
          error(`Cannot coerce null or undefined to ${this.#targetType}`);
        }
        if (this.#valueType === 'object') return this.#value;
        if (this.#valueType === 'string') {
          return console.log('String to object');
        }
    }
  }
}

// Test the functionality
console.log('Starting debug test...');
debugger; // This will force the debugger to stop here
console.log('Converting ', new CoerceToType({ a: 'lol' }, 'bigint').coerce());
console.log('Debug test completed');
