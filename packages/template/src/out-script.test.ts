import { describe, expect, test } from 'vitest';
import { OutScript } from './out-script';
import { EngineOptions } from './types';
import { defaultOptions } from './engine';

const _out = (options?: Partial<EngineOptions>) =>
  new OutScript({ ...defaultOptions, ...options });

test('escape \\', () => {
  const out = _out();
  out.pushStr(`\\`);
  expect(out.value).toMatchInlineSnapshot(`"s+="\\\\";"`);
});

test('escape \\n', () => {
  const out = _out();
  out.pushStr(`\n`);
  expect(out.value).toMatchInlineSnapshot(`"s+="\\n";"`);
});

test('escape "', () => {
  const out = _out();
  out.pushStr(`"`);
  expect(out.value).toMatchInlineSnapshot(`"s+="\\"";"`);
});

test('escape \\{{ ', () => {
  const out = _out();
  out.pushStr(`\\{{ x }}`);
  expect(out.value).toMatchInlineSnapshot(`"s+="{{ x }}";"`);
});

test('escape dynamic values with external function', () => {
  const out = _out();
  out.pushVar('x');
  expect(out.value).toMatchInlineSnapshot(`"s+=e(x);"`);
});

describe('compileStatement', () => {
  const out = _out();

  test('basic', () => {
    expect(
      out.compileStatement(
        [
          {
            type: 'expression',
            value: 'x',
          },
          {
            type: 'operator',
            value: '===',
          },
          {
            type: 'expression',
            value: 'y',
          },
        ],
        'c',
      ),
    ).toMatchInlineSnapshot(`"c.x===c.y"`);
  });

  test('not', () => {
    expect(
      out.compileStatement(
        [
          {
            type: 'expression',
            value: '!x',
          },
          {
            type: 'operator',
            value: 'in',
          },
          {
            type: 'expression',
            value: '!y',
          },
        ],
        'c',
      ),
    ).toMatchInlineSnapshot(`"!c.x in !c.y"`);
  });

  test('filter', () => {
    expect(
      out.compileStatement(
        [
          {
            type: 'expression',
            value: 'x',
            filters: [
              {
                name: 'f',
                args: '',
              },
            ],
          },
          {
            type: 'operator',
            value: '===',
          },
          {
            type: 'expression',
            value: 'y',
            filters: [
              {
                name: 'f',
                args: '',
              },
            ],
          },
        ],
        'c',
      ),
    ).toMatchInlineSnapshot(`"await f.f.call(c,c.x)===await f.f.call(c,c.y)"`);
  });

  test('filter w/ named args', () => {
    expect(
      out.compileStatement(
        [
          {
            type: 'expression',
            value: '!x',
            filters: [
              {
                name: 'f',
                args: '"a"',
              },
            ],
          },
          {
            type: 'operator',
            value: '===',
          },
          {
            type: 'expression',
            value: '!y',
            filters: [
              {
                name: 'f',
                args: '"a" `b`',
              },
            ],
          },
        ],
        'c',
      ),
    ).toMatchInlineSnapshot(
      `"await f.f.call(c,!c.x,"a")===await f.f.call(c,!c.y,"a",\`b\`)"`,
    );
    expect(
      out.compileStatement(
        [
          {
            type: 'expression',
            value: '!x',
            filters: [
              {
                name: 'f',
                args: 'a="a"',
              },
            ],
          },
          {
            type: 'operator',
            value: '===',
          },
          {
            type: 'expression',
            value: '!y',
            filters: [
              {
                name: 'f',
                args: 'a=a b=`b`',
              },
            ],
          },
        ],
        'c',
      ),
    ).toMatchInlineSnapshot(
      `"await f.f.call(c,!c.x,{a:"a"})===await f.f.call(c,!c.y,{a:c.a,b:\`b\`})"`,
    );
  });
});
