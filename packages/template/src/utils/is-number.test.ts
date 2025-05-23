import { expect, test } from 'vitest';
import { isNumber } from './is-number';

test('basic', () => {
  expect(isNumber('1')).toBe(true);
  expect(isNumber('1.1')).toBe(true);
  expect(isNumber('-1')).toBe(true);
  expect(isNumber('-1.1')).toBe(true);
  expect(isNumber('1e+10')).toBe(true);
  expect(isNumber('1e-10')).toBe(true);
  expect(isNumber('true')).toBe(false);
  expect(isNumber('false')).toBe(false);
  expect(isNumber('null')).toBe(false);
  expect(isNumber('undefined')).toBe(false);
});
