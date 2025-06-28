import { StrictNumberConverter } from './src/classes/StrictNumberConverter.js';
import { performance } from 'node:perf_hooks';

// Create a large nested object for performance testing
function createLargeNestedObject(depth = 5, breadth = 10) {
  const obj = {};

  function addNestedProperties(currentObj, currentDepth) {
    if (currentDepth >= depth) return;

    for (let i = 0; i < breadth; i++) {
      const key = `key_${currentDepth}_${i}`;

      if (i % 4 === 0) {
        currentObj[key] = Math.random() * 1000;
      } else if (i % 4 === 1) {
        currentObj[key] = `${Math.random() * 100}+${Math.random() * 100}`;
      } else if (i % 4 === 2) {
        currentObj[key] = `${Math.random() * 100}.${Math.floor(
          Math.random() * 100,
        )}.${Math.floor(Math.random() * 100)}`;
      } else {
        currentObj[key] = {};
        addNestedProperties(currentObj[key], currentDepth + 1);
      }
    }
  }

  addNestedProperties(obj, 0);
  return obj;
}

// Create a very deep object for testing recursion limits
function createDeepObject(depth = 20) {
  let obj = { value: Math.random() * 100 };
  for (let i = 0; i < depth; i++) {
    obj = { nested: obj };
  }
  return obj;
}

// Performance measurement function
function measurePerformance(fn, iterations = 1000) {
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const end = performance.now();
  return (end - start) / iterations; // Average time per iteration
}

// Test data
const testObject = createLargeNestedObject(4, 8);
const deepObject = createDeepObject(15);
const converter = new StrictNumberConverter(testObject);
const deepConverter = new StrictNumberConverter(deepObject);

console.log('Performance Test Results:');
console.log('========================');

// Measure current implementation
const convertToSumTime = measurePerformance(() => converter.convertToSum());
const convertToNumberTime = measurePerformance(() =>
  converter.convertToNumber(),
);

console.log(
  `Current convertToSum average time: ${convertToSumTime.toFixed(4)}ms`,
);
console.log(
  `Current convertToNumber average time: ${convertToNumberTime.toFixed(4)}ms`,
);

// Test deep object performance
console.log('\nDeep Object Test:');
try {
  const deepSumTime = measurePerformance(
    () => deepConverter.convertToSum(),
    100,
  );
  const deepNumberTime = measurePerformance(
    () => deepConverter.convertToNumber(),
    100,
  );
  console.log(
    `Deep object convertToSum average time: ${deepSumTime.toFixed(4)}ms`,
  );
  console.log(
    `Deep object convertToNumber average time: ${deepNumberTime.toFixed(4)}ms`,
  );
} catch (error) {
  console.log('Deep object test failed:', error.message);
}

// Store baseline for comparison
global.baselineSum = convertToSumTime;
global.baselineNumber = convertToNumberTime;
