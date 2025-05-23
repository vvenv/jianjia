import { describe, expect, it } from 'vitest'
import { parse } from '../../test/__helper'

it('basic', async () => {
  expect(
    await parse(`{{ #if name }}{{= name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";if(c.name){s+=e(c.name);}return s;})();"`,
  )

  expect(
    await parse(`{{ #if name }}{{= name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";if(c.name){s+=e(c.name);}return s;})();"`,
  )
})

it('not', async () => {
  expect(
    await parse(`{{ #if not name }}{{= name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";if(!c.name){s+=e(c.name);}return s;})();"`,
  )

  expect(
    await parse(`{{ #if !name }}{{= name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";if(!c.name){s+=e(c.name);}return s;})();"`,
  )
})

it('and', async () => {
  expect(
    await parse(`{{ #if x and y }}{{= z }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";if(c.x&&c.y){s+=e(c.z);}return s;})();"`,
  )

  expect(await parse(`{{ #if !x&&y }}{{= z }}{{ /if }}`)).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";if(!c.x&&c.y){s+=e(c.z);}return s;})();"`,
  )
})

it('in', async () => {
  expect(
    await parse(`{{ #if name in names }}{{= name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";if(c.name in c.names){s+=e(c.name);}return s;})();"`,
  )

  expect(
    await parse(`{{ #if name in ["foo", "bar"] }}{{= name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";if(c.name in ["foo", "bar"]){s+=e(c.name);}return s;})();"`,
  )
})

it('equal', async () => {
  expect(
    await parse(`{{ #if name eq other }}{{= name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";if(c.name===c.other){s+=e(c.name);}return s;})();"`,
  )

  expect(
    await parse(`{{ #if name == other }}{{= name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";if(c.name==c.other){s+=e(c.name);}return s;})();"`,
  )

  expect(
    await parse(`{{ #if name === other }}{{= name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";if(c.name===c.other){s+=e(c.name);}return s;})();"`,
  )

  expect(
    await parse(`{{ #if name == "foo" }}{{= name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";if(c.name=="foo"){s+=e(c.name);}return s;})();"`,
  )
})

it('not equal', async () => {
  expect(
    await parse(`{{ #if name ne other }}{{= name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";if(c.name!==c.other){s+=e(c.name);}return s;})();"`,
  )

  expect(
    await parse(`{{ #if name != other }}{{= name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";if(c.name!=c.other){s+=e(c.name);}return s;})();"`,
  )

  expect(
    await parse(`{{ #if name !== other }}{{= name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";if(c.name!==c.other){s+=e(c.name);}return s;})();"`,
  )

  expect(
    await parse(`{{ #if name != "foo" }}{{= name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";if(c.name!="foo"){s+=e(c.name);}return s;})();"`,
  )
})

it('else', async () => {
  expect(
    await parse(`{{ #if name }}{{= name }}{{ else }}{{= "*" }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";if(c.name){s+=e(c.name);}else{s+=e("*");}return s;})();"`,
  )
})

it('elif', async () => {
  expect(
    await parse(
      `{{ #if name == "foo" }}>>>{{ elif name == "bar" }}---{{ elif name == "baz" }}...{{ else }}{{= name }}{{ /if }}`,
    ),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";if(c.name=="foo"){s+=">>>";}else if(c.name=="bar"){s+="---";}else if(c.name=="baz"){s+="...";}else{s+=e(c.name);}return s;})();"`,
  )
})

describe('filter', async () => {
  it('basic', async () => {
    expect(
      await parse(`{{ #if name | length }}{{= name }}{{ /if }}`),
    ).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";if(await f.length.call(c,c.name)){s+=e(c.name);}return s;})();"`,
    )
  })

  it('multiple', async () => {
    expect(
      await parse(`{{ #if name | length | odd }}{{= name }}{{ /if }}`),
    ).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";if(await f.odd.call(c,await f.length.call(c,c.name))){s+=e(c.name);}return s;})();"`,
    )
  })

  it('w/ args', async () => {
    expect(
      await parse(`{{ #if names | join: "" == "foobar" }}yes{{ /if }}`),
    ).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";if(await f.join.call(c,c.names,"")=="foobar"){s+="yes";}return s;})();"`,
    )
  })
})

it('whitespace control', async () => {
  expect(
    await parse(
      ' hello {{ #if name }} {{= name }} {{ else }} world {{ /if }} ',
    ),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=" hello ";if(c.name){s+=" ";s+=e(c.name);s+=" ";}else{s+=" world ";}s+=" ";return s;})();"`,
  )

  expect(
    await parse(
      ' hello {{- #if name -}} {{-= name -}} {{- else -}} world {{- /if -}} ',
    ),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=" hello";if(c.name){s+=e(c.name);}else{s+="world";}return s;})();"`,
  )

  expect(
    await parse(
      ' hello {{- #if name }} {{-= name }} {{- else }} world {{- /if }} ',
    ),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=" hello";if(c.name){s+=e(c.name);}else{s+=" world";}s+=" ";return s;})();"`,
  )

  expect(
    await parse(
      ' hello {{ #if name -}} {{= name -}} {{ else -}} world {{ /if -}} ',
    ),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=" hello ";if(c.name){s+=e(c.name);}else{s+="world ";}return s;})();"`,
  )
})

it('invalid', async () => {
  expect(await parse('{{ #if }}{{ /if }}')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+="{{ #if }}{{ /if }}";return s;})();"`,
  )

  expect(await parse('{{ #for x in y }}{{ /if }}')).toMatchInlineSnapshot(
    `""`,
  )

  expect(
    await parse('{{ #for x in y }}{{ /if }}', { debug: true }),
  ).toMatchInlineSnapshot(`
    " JianJia  "end_if" must follow "if", not "for".

    1: {{ #for x in y }}{{ /if }}
       ^^^^^^^^^^^^^^^^^
                        ^^^^^^^^^
    "
  `)

  expect(parse('{{ #for x in y }}{{ elif z }}')).toMatchInlineSnapshot(
    `Promise {}`,
  )

  expect(
    await parse('{{ #for x in y }}{{ elif z }}', { debug: true }),
  ).toMatchInlineSnapshot(`
    " JianJia  "elif" must follow "if", not "for".

    1: {{ #for x in y }}{{ elif z }}
       ^^^^^^^^^^^^^^^^^
                        ^^^^^^^^^^^^
    "
  `)
})
