import { expect, test } from 'vitest';
import { isTag } from './is-tag';

test('basic', () => {
  expect(isTag('#x')).toBe(true);
  expect(isTag('/x')).toBe(true);
  expect(isTag('x#x')).toBe(false);
  expect(isTag('x/x')).toBe(false);
});
