import { describe, expect, test } from 'vitest';
import { parse } from '../test/__helper';

describe('stripComments', async () => {
  test('on', async () => {
    expect(await parse(`{{ ! this is a comment }}`)).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";return s;})();"`,
    );
  });

  test('off', async () => {
    expect(
      await parse(`{{ ! this is a comment }}`, {
        stripComments: false,
      }),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+="<!--this is a comment-->";return s;})();"`,
    );
  });
});

describe('strictMode', async () => {
  test('on', async () => {
    expect(await parse(``)).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";return s;})();"`,
    );
  });

  test('off', async () => {
    expect(
      await parse(``, {
        strictMode: false,
      }),
    ).toMatchInlineSnapshot(`"return (async ()=>{let s="";return s;})();"`);
  });
});

test('start and end', async () => {
  expect(
    await parse(`{% #for name in names %}{{ name }} in {{ names }}{% /for %}`, {
      start: '{%',
      end: '%}',
    }),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";const o_1_0=c.names;const a_1_0=Array.isArray(o_1_0);const k_1_0=Object.keys(o_1_0);const l_1_0=k_1_0.length;for(let i_1_0=0;i_1_0<l_1_0;i_1_0++){const _item=o_1_0[k_1_0[i_1_0]];const c_i_1_0={...c,name:_item,loop:{index:i_1_0,first:i_1_0===0,last:i_1_0===l_1_0,length:l_1_0}};s+="{{ name }} in {{ names }}";}return s;})();"`,
  );
});

test('empty', async () => {
  expect(await parse(``)).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";return s;})();"`,
  );
});

test('html tags', async () => {
  expect(await parse(`<foo>foo</foo>`)).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+="<foo>foo</foo>";return s;})();"`,
  );
});

test('quotes', async () => {
  expect(await parse(`"'foo'"`)).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+="\\"'foo'\\"";return s;})();"`,
  );
});

test('line break feed', async () => {
  expect(await parse(`\nfoo\n`)).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+="\\nfoo\\n";return s;})();"`,
  );
});

test('invalid', async () => {
  expect(await parse(`{{ /if }}`, { debug: true })).toMatchInlineSnapshot(
    `
    " JianJia  "end_if" must follow "if", not "root".

    1: {{ /if }}
       
       ^^^^^^^^^
    "
  `,
  );
});

test('translate', async () => {
  expect(
    await parse(`{{ "hello, {name}" | t name="IJK" }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e(await f.t.call(c,"hello, {name}",{name:"IJK"}));return s;})();"`,
  );
});
