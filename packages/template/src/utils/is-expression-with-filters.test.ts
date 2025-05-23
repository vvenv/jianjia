import { expect, test } from 'vitest';
import { isExpressionWithFilters } from './is-expression-with-filters';

test('basic', () => {
  expect(isExpressionWithFilters('a | f')).toBe(true);
  expect(isExpressionWithFilters('a | f x')).toBe(true);
  expect(isExpressionWithFilters('a | f " | " y')).toBe(true);
  expect(isExpressionWithFilters('a | f "|"+y')).toBe(true);
  expect(isExpressionWithFilters('a + b | f')).toBe(true);
  expect(isExpressionWithFilters('a - b | f x')).toBe(true);
  expect(isExpressionWithFilters('a * b | f " | " y')).toBe(true);
  expect(isExpressionWithFilters('a * b | f "|"+y | f x[0]-o.y')).toBe(true);
});
