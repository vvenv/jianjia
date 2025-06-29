import { expect, it } from 'vitest'
import { compile } from '../../test/__helper'

it('basic', async () => {
  expect(await compile('{{ assign x = "" }}')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";Object.assign(c,{x:""});return s;})();"`,
  )

  expect(await compile('{{ assign x = y }}')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";Object.assign(c,{x:c.y});return s;})();"`,
  )

  expect(await compile('{{ assign x = "a" }}')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";Object.assign(c,{x:"a"});return s;})();"`,
  )

  expect(await compile('{{ #assign x }}{{= y }}{{ /assign }}')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";Object.assign(c,{x:await(async(s)=>{s+=e(c.y);return s;})("")});return s;})();"`,
  )

  expect(await compile('{{ #assign x }}a{{ /assign }}')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";Object.assign(c,{x:await(async(s)=>{s+="a";return s;})("")});return s;})();"`,
  )
})

it('invalid', async () => {
  expect(
    await compile('{{ assign }}', { debug: true }),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+="{{ assign }}";return s;})();"`,
  )

  expect(
    await compile('{{ assign x = y = 1 }}', { debug: true }),
  ).toMatchInlineSnapshot(
    `
    " JianJia  invalid tag data

    1: {{ assign x = y = 1 }}
       ^^^^^^^^^^^^^^^^^^^^^^
    "
  `,
  )

  expect(
    await compile('{{ assign 1 = "a" }}', { debug: true }),
  ).toMatchInlineSnapshot(
    `
    " JianJia  invalid tag data

    1: {{ assign 1 = "a" }}
       ^^^^^^^^^^^^^^^^^^^^
    "
  `,
  )

  expect(await compile('{{ #assign x, y }}a{{ /assign }}', { debug: true })).toMatchInlineSnapshot(
    `
    " JianJia  invalid tag data

    1: {{ #assign x, y }}a{{ /assign }}
       ^^^^^^^^^^^^^^^^^^
    "
  `,
  )
})

it('w/ expression', async () => {
  expect(await compile('{{ assign x = y and z }}')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";Object.assign(c,{x:c.y&&c.z});return s;})();"`,
  )
})

it('w/ filter', async () => {
  expect(await compile('{{ assign x = y | f: a }}')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";Object.assign(c,{x:await f.f.call(c,c.y,c.a)});return s;})();"`,
  )
})

it('destructure', async () => {
  expect(await compile(`{{ assign x, y, z = a }}`)).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";Object.assign(c,{x:c.a.x,y:c.a.y,z:c.a.z});return s;})();"`,
  )
})

it('override', async () => {
  expect(
    await compile(`{{ assign x = 'y' }}{{ assign x = "y" }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";Object.assign(c,{x:'y'});Object.assign(c,{x:"y"});return s;})();"`,
  )
})
