import { expect, test } from 'vitest';
import { compileExpression as ce } from './compile-expression';

test('basic', () => {
  expect(ce('x', 'c')).toBe('c.x');
  expect(ce('x.y', 'c')).toBe('c.x.y');
  expect(ce('x[y]', 'c')).toBe('c.x[c.y]');
  expect(ce('x++', 'c')).toBe('c.x++');
  expect(ce('++x', 'c')).toBe('++c.x');
});

test('literal', () => {
  [
    'true',
    'false',
    'null',
    'undefined',
    '1',
    '1.1',
    '"*"',
    '"x"',
    "'x'",
    '`x`',
    '{"x":1}',
    '[1]',
  ].forEach((value) => {
    expect(ce(value, 'c')).toBe(value);
  });
});

test('arithmetic', () => {
  [
    '+',
    '-',
    '*',
    '/',
    '%',
    '&&',
    '||',
    '==',
    '!=',
    '===',
    '!==',
    '>',
    '>=',
    '<',
    '<=',
  ].forEach((op) => {
    expect(ce(`1 ${op} 2`, 'c')).toBe(`1 ${op} 2`);
    expect(ce(`1${op}2`, 'c')).toBe(`1${op}2`);
    expect(ce(`x ${op} y`, 'c')).toBe(`c.x ${op} c.y`);
    expect(ce(`x${op}y`, 'c')).toBe(`c.x${op}c.y`);
    expect(ce(`x${op}"y"`, 'c')).toBe(`c.x${op}"y"`);
    expect(ce(`x${op}1`, 'c')).toBe(`c.x${op}1`);
    expect(ce(`1${op}y`, 'c')).toBe(`1${op}c.y`);
  });
});

test('ternary conditional', () => {
  expect(ce('x ? x : "x"', 'c')).toBe('c.x ? c.x : "x"');
  expect(ce('x?x:"x"', 'c')).toBe('c.x?c.x:"x"');
});

test('w/ filters', () => {
  expect(
    ce('x', 'c', [
      { name: 'y', args: '1' },
      { name: 'z', args: '' },
    ]),
  ).toMatchInlineSnapshot(`"await f.z.call(c,await f.y.call(c,c.x,1))"`);
  expect(
    ce('x', 'c', [
      { name: 'y', args: '"1"' },
      { name: 'z', args: '' },
    ]),
  ).toMatchInlineSnapshot(`"await f.z.call(c,await f.y.call(c,c.x,"1"))"`);
});

test('real world', () => {
  expect(
    ce('"hello, {name}"', 'c', [
      {
        name: 't',
        args: 'name="IJK"',
      },
    ]),
  ).toMatchInlineSnapshot(`"await f.t.call(c,"hello, {name}",{name:"IJK"})"`);
  expect(
    ce('x', 'c', [
      {
        name: 't',
        args: 'name="IJK"',
      },
    ]),
  ).toMatchInlineSnapshot(`"await f.t.call(c,c.x,{name:"IJK"})"`);
});
