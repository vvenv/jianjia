import { expect, test } from 'vitest';
import { parseActualArgs } from './parse-actual-args';

test('basic', () => {
  expect(parseActualArgs('a', 'c')).toEqual(['c.a']);
});

test('multiple', () => {
  expect(parseActualArgs('a b', 'c')).toEqual(['c.a', 'c.b']);
  expect(parseActualArgs('a  b', 'c')).toEqual(['c.a', 'c.b']);
  expect(parseActualArgs('a a', 'c')).toEqual(['c.a', 'c.a']);
});

test('named', () => {
  expect(parseActualArgs('a=b', 'c')).toEqual(['{a:c.b}']);
  expect(parseActualArgs('a="b"', 'c')).toEqual(['{a:"b"}']);
  expect(parseActualArgs('a=a', 'c')).toEqual(['{a:c.a}']);
  expect(parseActualArgs('a=a b=`b`', 'c')).toEqual(['{a:c.a,b:`b`}']);
  expect(parseActualArgs('a=true b=1', 'c')).toEqual(['{a:true,b:1}']);
});

test('literal', () => {
  expect(parseActualArgs("''", 'c')).toEqual(["''"]);
  expect(parseActualArgs('""', 'c')).toEqual(['""']);
  expect(parseActualArgs('``', 'c')).toEqual(['``']);
  expect(parseActualArgs('","', 'c')).toEqual(['","']);
  expect(parseActualArgs('true', 'c')).toEqual(['true']);
  expect(parseActualArgs('1', 'c')).toEqual(['1']);
  expect(parseActualArgs('"a"', 'c')).toEqual(['"a"']);
  expect(parseActualArgs('"a" "b"', 'c')).toEqual(['"a"', '"b"']);
  expect(parseActualArgs('"a" "a"', 'c')).toEqual(['"a"', '"a"']);
});

test('mixture', () => {
  expect(parseActualArgs('\'a\' "a" `a` a', 'c')).toEqual([
    "'a'",
    '"a"',
    '`a`',
    'c.a',
  ]);
  expect(parseActualArgs('\',\' "," `,` a', 'c')).toEqual([
    "','",
    '","',
    '`,`',
    'c.a',
  ]);
});
