import { expect, it } from 'vitest'
import { parse } from '../../test/__helper'

it('basic', async () => {
  expect(
    await parse(
      `{{ #with obj }}{{= key1 }} and {{= key2 }}{{ /with }}`,
    ),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";const c_1_0={...c,...c.obj};s+=e(c_1_0.key1);s+=" and ";s+=e(c_1_0.key2);return s;})();"`,
  )
})

it('invalid', async () => {
  expect(
    await parse(
      `{{ #with }}{{= key1 }} and {{= key2 }}{{ /with }}`,
    ),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+="{{ #with }}";s+=e(c.key1);s+=" and ";s+=e(c.key2);s+="{{ /with }}";return s;})();"`,
  )
})
