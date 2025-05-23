import { expect, it } from 'vitest'
import { parse } from '../../test/__helper'

it('basic', async () => {
  expect(await parse(`{{ #macro m }}MACRO{{ /macro }}`)).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";c.m=async(_c)=>{s+="MACRO";};return s;})();"`,
  )
  expect(
    await parse(`{{ #macro m: x, y }}{{= x }}{{= y }}{{ /macro }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";c.m=async(_c,x,y)=>{const c_1_0={...c,x,y,};s+=e(c_1_0.x);s+=e(c_1_0.y);};return s;})();"`,
  )
})

it('default args', async () => {
  expect(
    await parse(`{{ #macro m: x="f", y=1 }}{{= x }}{{= y }}{{ /macro }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";c.m=async(_c,x="f",y=1)=>{const c_1_0={...c,x,y,};s+=e(c_1_0.x);s+=e(c_1_0.y);};return s;})();"`,
  )
})

it('caller', async () => {
  expect(
    await parse(`{{ #macro n: x, y }}{{= x }}{{ caller }}{{= y }}{{ /macro }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";c.n=async(_c,x,y)=>{const c_1_0={...c,x,y,};s+=e(c_1_0.x);await _c?.();s+=e(c_1_0.y);};return s;})();"`,
  )
})

it('invalid', async () => {
  expect(await parse(`{{ #macro }}{{ /macro }}`)).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+="{{ #macro }}{{ /macro }}";return s;})();"`,
  )

  expect(
    await parse(`{{ #macro }}{{ /macro }}`, {
      debug: true,
    }),
  ).toMatchInlineSnapshot(
    `
    " JianJia  "end_macro" must follow "macro", not "root".

    1: {{ #macro }}{{ /macro }}
                   ^^^^^^^^^^^^
    "
  `,
  )

  expect(await parse(`{{ #macro 1 }}{{ /macro }}`)).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+="{{ #macro 1 }}{{ /macro }}";return s;})();"`,
  )

  expect(
    await parse(`{{ #macro 1 }}{{ /macro }}`, {
      debug: true,
    }),
  ).toMatchInlineSnapshot(`
    " JianJia  "end_macro" must follow "macro", not "root".

    1: {{ #macro 1 }}{{ /macro }}
                     ^^^^^^^^^^^^
    "
  `)

  expect(await parse(`{{ caller }}`)).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+="{{ caller }}";return s;})();"`,
  )

  expect(
    await parse(`{{ caller }}`, {
      debug: true,
    }),
  ).toMatchInlineSnapshot(
    `
    " JianJia  "caller" must follow "macro", not "root".

    1: {{ caller }}
       ^^^^^^^^^^^^
    "
  `,
  )
})
