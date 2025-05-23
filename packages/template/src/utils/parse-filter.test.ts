import { expect, test } from 'vitest';
import { parseFilter } from './parse-filter';

test('basic', () => {
  expect(parseFilter('abs')).toEqual({ name: 'abs' });
});

test('name and args', () => {
  expect(parseFilter('replace "a" b.c')).toEqual({
    name: 'replace',
    args: '"a" b.c',
  });
  expect(parseFilter('replace ":" "-"')).toEqual({
    name: 'replace',
    args: '":" "-"',
  });
  expect(parseFilter('replace a=a b="b"')).toEqual({
    name: 'replace',
    args: 'a=a b="b"',
  });
  expect(parseFilter('t b="b"')).toEqual({
    name: 't',
    args: 'b="b"',
  });
});
