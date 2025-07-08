# Transformation Utils

A utility library for data transformation, type coercion, and value manipulation in JavaScript.

## Installation

```bash
npm install transformation-utils
```

## Usage

### Import the entire library

```javascript
import {
  AddValues,
  StrictNumberConverter,
  CoerceToType,
  StringifyValue,
} from 'transformation-utils';
```

### Import specific modules

```javascript
import { AddValues } from 'transformation-utils/addValues';
import { StrictNumberConverter } from 'transformation-utils/strictNumberConverter';
import { CoerceToType } from 'transformation-utils/coerceToType';
import { StringifyValue } from 'transformation-utils/stringifyValue';
```

## API Reference

### AddValues

Adds two values with intelligent type handling and fallback to string concatenation.

```javascript
import { AddValues } from 'transformation-utils';

// Numeric addition
const result1 = new AddValues(5, 3).add(); // 8
const result2 = new AddValues('10', '20').add(); // 30

// String concatenation fallback
const result3 = new AddValues('hello', 'world').add(); // 'helloworld'
const result4 = new AddValues('123', 'abc').add(); // '123abc'

// Array concatenation
const result5 = new AddValues([1, 2], [3, 4]).add(); // [1, 2, 3, 4]

// Object merging
const result6 = new AddValues({ a: 1 }, { b: 2 }).add(); // {a: 1, b: 2}
```

### StrictNumberConverter

Converts values to numbers with strict validation.

```javascript
import { StrictNumberConverter } from 'transformation-utils';

// Valid conversions
const converter1 = new StrictNumberConverter('123');
console.log(converter1.convertToNumber()); // 123

const converter2 = new StrictNumberConverter('3.14');
console.log(converter2.convertToNumber()); // 3.14

// Nested object conversion
const converterNested = new StrictNumberConverter({ value: '456' }.value);
console.log(converterNested.convertToNumber()); // 456

// Invalid conversions throw errors
try {
  const converter3 = new StrictNumberConverter('abc');
  converter3.convertToNumber(); // Throws error
} catch (error) {
  console.log(error.message); // "There is no digits in your string"
}
```

### CoerceToType

Coerces values to specific types with validation.

```javascript
import { CoerceToType } from 'transformation-utils';

// String coercion
const stringResult = new CoerceToType('hello', 'string').coerce(); // 'hello'

// Number coercion
const numberResult = new CoerceToType('123', 'number').coerce(); // 123

// Boolean coercion
const boolResult = new CoerceToType('true', 'boolean').coerce(); // true

// Array coercion
const arrayResult = new CoerceToType('1,2,3', 'array').coerce(); // [1, 2, 3]

// Object coercion
const objectResult = new CoerceToType('{"a": 1}', 'object').coerce(); // {a: 1}
```

### StringifyValue

Converts any value to a string representation.

```javascript
import { StringifyValue } from 'transformation-utils';

const stringifier = new StringifyValue();

// Basic types
console.log(stringifier.stringify(42)); // "42"
console.log(stringifier.stringify(true)); // "true"
console.log(stringifier.stringify(null)); // "null"

// Objects and arrays

console.log(stringifier.stringify({ a: 1, b: 2 })); // '{"a":1,"b":2}'
console.log(stringifier.stringify([1, 2, 3])); // "[1,2,3]"

// Functions
console.log(stringifier.stringify(() => {})); // "function"
```

## Error Handling

The library includes a centralized error handling system:

```javascript
import { error } from 'transformation-utils';

// The error helper is used internally by the classes
// You can also use it in your own code if needed
error('Custom error message');
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

ISC License - see LICENSE file for details.

## Author

Natalia Novikova <novikovanatalie@protonmail.com>
