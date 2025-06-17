import helloWorld from '../src/helloWorld.js';

import { expect, test } from 'vitest';

test('hello world', () => {
  expect(helloWorld()).toBe('Hello, World!');
});
