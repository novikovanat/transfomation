export class StringifyValue {
  constructor(value) {
    this.value = value;
    this.type = typeof this.value;
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
    switch (this.type) {
      case 'string':
        return this.value;

      case 'undefined':
        return 'undefined';

      case 'object': {
        if (this.value === null) {
          return 'null';
        }
        try {
          return JSON.stringify(this.value);
        } catch (error) {
          if (error.message.includes('circular')) {
            return JSON.stringify(this.value, this.#getCircularReplacer());
          }
          throw error;
        }
      }
      default:
        return this.value.toString();
    }
  }
}
