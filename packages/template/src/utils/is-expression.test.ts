import { expect, test } from 'vitest';
import { isExpression } from './is-expression';

test('arithmetic', () => {
  expect(isExpression('a+b')).toBe(true);
  expect(isExpression('a-b')).toBe(true);
  expect(isExpression('a*b')).toBe(true);
  expect(isExpression('a/b')).toBe(true);
  expect(isExpression('a + b')).toBe(true);
  expect(isExpression('a - b')).toBe(true);
  expect(isExpression('a * b')).toBe(true);
  expect(isExpression('a / b')).toBe(true);
});

test('array', () => {
  expect(isExpression('a[0]')).toBe(true);
  expect(isExpression('a[1][2]')).toBe(true);
});

test('object', () => {
  expect(isExpression('o.x')).toBe(true);
  expect(isExpression('o.x.y')).toBe(true);
});

test('mixture', () => {
  expect(isExpression('o.x[1] + a[0].y')).toBe(true);
});

test('real world', () => {
  expect(isExpression('"md:block" if page.toc')).toBe(true);
});
