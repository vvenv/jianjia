import { expect, test } from 'vitest';
import { isLiteralWithFilters } from './is-literal-with-filters';

test('primitive', () => {
  expect(isLiteralWithFilters('true | t x="a"')).toBe(true);
  expect(isLiteralWithFilters('false | t x="a"')).toBe(true);
  expect(isLiteralWithFilters('null | t x="a"')).toBe(true);
  expect(isLiteralWithFilters('undefined | t x="a"')).toBe(true);
  expect(isLiteralWithFilters('"a" | t x="a"')).toBe(true);
  expect(isLiteralWithFilters('1 | t x="a"')).toBe(true);
  expect(isLiteralWithFilters('[] | t x="a"')).toBe(true);
  expect(isLiteralWithFilters('function() {} | t x="a"')).toBe(false);
  expect(isLiteralWithFilters('() => {} | t x="a"')).toBe(false);
  expect(isLiteralWithFilters('someVariable | t x="a"')).toBe(false);
  expect(isLiteralWithFilters('[1, 2].map(x => x * 2) | t x="a"')).toBe(false);
});
