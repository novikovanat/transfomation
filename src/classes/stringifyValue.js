export class StringifyValue {
  #value;
  #type;

  constructor(value) {
    this.#value = value;
    this.#type = typeof value;
  }

  #getCircularReplacer() {
    const seen = new WeakSet();
    return function (key, value) {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular Reference]';
        }
        seen.add(value);
      }
      return value;
    };
  }

  toString() {
    return this.#toString(this.#type, this.#value);
  }

  #toString(type, value) {
    switch (type) {
      case 'string':
        return value;

      case 'undefined':
        return 'undefined';

      case 'object': {
        if (value === null) {
          return 'null';
        }
        try {
          return JSON.stringify(value);
        } catch (error) {
          if (error.message.includes('circular')) {
            return JSON.stringify(value, this.#getCircularReplacer());
          }
          throw error;
        }
      }
      default:
        return value.toString();
    }
  }
}
