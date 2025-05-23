import { describe, expect, test } from 'vitest';
import { parse } from '../../test/__helper';

test('basic', async () => {
  expect(await parse(`{{ #macro m }}MACRO{{ /macro }}`)).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";c.m=async(_c)=>{s+="MACRO";};return s;})();"`,
  );
  expect(
    await parse(`{{ #macro m x y }}{{ x }}{{ y }}{{ /macro }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";c.m=async(_c,x,y)=>{const c_m_1_0={...c,x,y,};s+=e(c_m_1_0.x);s+=e(c_m_1_0.y);};return s;})();"`,
  );
});

test('default args', async () => {
  expect(
    await parse(`{{ #macro m x="f" y=1 }}{{ x }}{{ y }}{{ /macro }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";c.m=async(_c,x="f",y=1)=>{const c_m_1_0={...c,x,y,};s+=e(c_m_1_0.x);s+=e(c_m_1_0.y);};return s;})();"`,
  );
});

test('caller', async () => {
  expect(
    await parse(`{{ #macro n x y }}{{ x }}{{ caller() }}{{ y }}{{ /macro }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";c.n=async(_c,x,y)=>{const c_m_1_0={...c,x,y,};s+=e(c_m_1_0.x);await _c?.();s+=e(c_m_1_0.y);};return s;})();"`,
  );
});

describe('validation', async () => {
  test('"caller" must follow "macro"', async () => {
    expect(await parse(`{{ caller() }}`)).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+="{{ caller() }}";return s;})();"`,
    );

    expect(
      await parse(`{{ caller() }}`, {
        debug: true,
      }),
    ).toMatchInlineSnapshot(`
      " JianJia  "caller" must follow "macro", not "root".

      1: {{ caller() }}
         
         ^^^^^^^^^^^^^^
      "
    `);
  });
});
