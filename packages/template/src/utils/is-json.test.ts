import { expect, test } from 'vitest';
import { isJSON } from './is-json';

test('basic', () => {
  expect(isJSON('{}')).toBe(true);
  expect(isJSON('{"x":1}')).toBe(true);
  expect(isJSON('[]')).toBe(true);
  expect(isJSON('["x"]')).toBe(true);
  expect(isJSON('[{}]')).toBe(true);
  expect(isJSON('{{}}')).toBe(false);
  expect(isJSON('[1, "string", {"a": true}]')).toBe(true);
  expect(isJSON('{"a": 1, "b": "string"}')).toBe(true);
});
