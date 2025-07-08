// Main entry point for the transformation library
export { AddValues } from './src/classes/addValues.js';
export { AddValues2 } from './src/classes/addValues2.js';
export { StrictNumberConverter } from './src/classes/StrictNumberConverter.js';
export { CoerceToType } from './src/classes/coerceToType.js';
export { StringifyValue } from './src/classes/stringifyValue.js';

// Re-export the error helper for convenience
export { default as error } from './src/helpers/errors.js';
