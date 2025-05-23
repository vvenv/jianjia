import { describe, expect, it } from 'vitest'
import { parse } from '../test/__helper'

describe('stripComments', async () => {
  it('on', async () => {
    expect(await parse(`{{! this is a comment }}`)).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";return s;})();"`,
    )
  })

  it('off', async () => {
    expect(
      await parse(`{{! this is a comment }}`, {
        stripComments: false,
      }),
    ).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";s+="<!--this is a comment-->";return s;})();"`,
    )
  })
})

describe('strictMode', async () => {
  it('on', async () => {
    expect(await parse(``)).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";return s;})();"`,
    )
  })

  it('off', async () => {
    expect(
      await parse(``, {
        strictMode: false,
      }),
    ).toMatchInlineSnapshot(`"return(async()=>{let s="";return s;})();"`)
  })
})

it('empty', async () => {
  expect(await parse(``)).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";return s;})();"`,
  )
})

it('html tags', async () => {
  expect(await parse(`<foo>foo</foo>`)).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+="<foo>foo</foo>";return s;})();"`,
  )
})

it('quotes', async () => {
  expect(await parse(`"'foo'"`)).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+="\\"'foo'\\"";return s;})();"`,
  )
})

it('line break feed', async () => {
  expect(await parse(`\nfoo\n`)).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+="\\nfoo\\n";return s;})();"`,
  )
})

it('translate', async () => {
  expect(
    await parse(`{{ "hello, {name}" | t name="IJK" }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+="{{ \\"hello, {name}\\" | t name=\\"IJK\\" }}";return s;})();"`,
  )
})

it('invalid', async () => {
  expect(await parse(`{{ /if }}`, { debug: true })).toMatchInlineSnapshot(
    `
    " JianJia  "end_if" must follow "if", not "root".

    1: {{ /if }}
       ^^^^^^^^^
    "
  `,
  )
})
