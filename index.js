// Main entry point for the transformation library
export { AddValues } from './src/classes/addValues.js';
export { StrictNumberConverter } from './src/classes/StrictNumberConverter.js';
export { CoerceToType } from './src/classes/coerceToType.js';
export { StringifyValue } from './src/classes/stringifyValue.js';

// Re-export the error helper for convenience
export { default as error } from './src/helpers/errors.js';
