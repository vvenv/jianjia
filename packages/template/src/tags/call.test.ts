import { expect, it } from 'vitest'
import { parse } from '../../test/__helper'

it('basic', async () => {
  expect(await parse(`{{ #call n: 1, 2 }}3{{ /call }}`)).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";await c.n(async()=>{s+="3";},1,2);return s;})();"`,
  )
  expect(await parse(`{{ #call n }}3{{ /call }}`)).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";await c.n(async()=>{s+="3";});return s;})();"`,
  )
})

it('macro and call', async () => {
  expect(
    await parse(
      `{{ #macro n: x, y }}{{= x }}{{ caller }}{{= y }}{{ /macro }}{{ #call n: 'f', 1 }}3{{ /call }}`,
    ),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";c.n=async(_c,x,y)=>{const c_1_0={...c,x,y,};s+=e(c_1_0.x);await _c?.();s+=e(c_1_0.y);};await c.n(async()=>{s+="3";},'f',1);return s;})();"`,
  )
})

it('invalid', async () => {
  expect(await parse(`{{ #call }}3{{ /call }}`)).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+="{{ #call }}3{{ /call }}";return s;})();"`,
  )

  expect(await parse(`{{ #call }}3{{ /call }}`, { debug: true })).toMatchInlineSnapshot(
    `
    " JianJia  "end_call" must follow "call", not "root".

    1: {{ #call }}3{{ /call }}
                   ^^^^^^^^^^^
    "
  `,
  )
})
