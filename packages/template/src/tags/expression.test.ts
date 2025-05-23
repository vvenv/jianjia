/* eslint-disable style/no-tabs */
import { describe, expect, it } from 'vitest'
import { parse } from '../../test/__helper'

it('basic', async () => {
  expect(await parse('{{= x }}')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=e(c.x);return s;})();"`,
  )
})

it('nesting', async () => {
  expect(await parse('{{= x }}{{= x.y }}{{= x.y.z }}')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=e(c.x);s+=e(c.x.y);s+=e(c.x.y.z);return s;})();"`,
  )
})

it('arithmetic', async () => {
  expect(
    await parse(
      '{{= x+2 }}{{= x-2 }}{{= x*2 }}{{= x/2 }}{{= x**2 }}{{= x%2 }}',
    ),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=e(c.x+2);s+=e(c.x-2);s+=e(c.x*2);s+=e(c.x/2);s+=e(c.x**2);s+=e(c.x%2);return s;})();"`,
  )

  expect(
    await parse(
      '{{= 2+x }}{{= 2-x }}{{= 2*x }}{{= 2/x }}{{= 2**x }}{{= 2%x }}',
    ),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=e(2+c.x);s+=e(2-c.x);s+=e(2*c.x);s+=e(2/c.x);s+=e(2**c.x);s+=e(2%c.x);return s;})();"`,
  )

  expect(await parse('{{= x++ }}{{= ++x }}')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=e(c.x++);s+=e(++c.x);return s;})();"`,
  )

  expect(await parse('{{= x-- }}{{= --x }}')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=e(c.x--);s+=e(--c.x);return s;})();"`,
  )
})

it('ternary conditional', async () => {
  expect(await parse(`{{= x ? x : "x" }}`)).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=e(c.x ? c.x : "x");return s;})();"`,
  )
})

it('array/object member', async () => {
  expect(
    await parse('{{= x[2] }}{{= y["foo"] }}{{= z.bar }}'),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=e(c.x[2]);s+=e(c.y["foo"]);s+=e(c.z.bar);return s;})();"`,
  )

  expect(await parse('{{= [1,2,3][4][5] }}')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=e([1,2,3][4][5]);return s;})();"`,
  )

  expect(await parse('{{= ["1","2","3"]["4"]["5"] }}')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=e(["1","2","3"]["4"]["5"]);return s;})();"`,
  )

  expect(
    await parse('{{= config.locales[page.locale]["lang"] }}'),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=e(c.config.locales[c.page.locale]["lang"]);return s;})();"`,
  )

  // not supported
  // expect(await parse('{{= config.locales[page.locale].lang }}')).toMatchInlineSnapshot();
})

it('escape', async () => {
  expect(await parse('{{= "\\{\\{= escape \\}\\}" }}')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=e("{{= escape }}");return s;})();"`,
  )

  expect(await parse('{{= "{\\{= escape }\\}" }}')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=e("{{= escape }}");return s;})();"`,
  )

  expect(await parse('{{= "\\{{= escape \\}}" }}')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=e("{{= escape }}");return s;})();"`,
  )
})

describe('literal', () => {
  it('string', async () => {
    expect(await parse('{{= "*" }}')).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";s+=e("*");return s;})();"`,
    )

    expect(await parse('{{= "**" }}')).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";s+=e("**");return s;})();"`,
    )

    expect(await parse('{{= "***" }}')).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";s+=e("***");return s;})();"`,
    )

    expect(await parse('{{= "\\"*" }}')).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";s+=e("\\"*");return s;})();"`,
    )
  })

  it('number', async () => {
    expect(await parse('{{= 1314 }}')).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";s+=e(1314);return s;})();"`,
    )

    expect(await parse('{{= 13.14 }}')).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";s+=e(13.14);return s;})();"`,
    )
  })

  it('boolean', async () => {
    expect(await parse('{{= true }}')).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";s+=e(true);return s;})();"`,
    )

    expect(await parse('{{= false }}')).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";s+=e(false);return s;})();"`,
    )
  })

  it('array', async () => {
    expect(await parse('{{= [1, "1"] }}')).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";s+=e([1, "1"]);return s;})();"`,
    )
  })
})

describe('w/ filters', async () => {
  it('basic', async () => {
    expect(await parse('{{= x | upper }}')).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";s+=e(await f.upper.call(c,c.x));return s;})();"`,
    )

    expect(await parse('{{= "x" | upper }}')).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";s+=e(await f.upper.call(c,"x"));return s;})();"`,
    )

    expect(await parse('{{= \'x\' | upper }}')).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";s+=e(await f.upper.call(c,'x'));return s;})();"`,
    )

    expect(await parse('{{= `x` | upper }}')).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";s+=e(await f.upper.call(c,\`x\`));return s;})();"`,
    )
  })

  it('multiple', async () => {
    expect(await parse('{{= x | upper | lower }}')).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";s+=e(await f.lower.call(c,await f.upper.call(c,c.x)));return s;})();"`,
    )
  })

  it('duo', async () => {
    expect(
      await parse('{{= x | upper }} and {{= x | upper }}'),
    ).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";s+=e(await f.upper.call(c,c.x));s+=" and ";s+=e(await f.upper.call(c,c.x));return s;})();"`,
    )
  })

  it('safe', async () => {
    expect(await parse('{{= x | safe }}')).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";s+=e(await f.safe.call(c,c.x));return s;})();"`,
    )
  })

  it('w/ args', async () => {
    expect(await parse(`{{= name | split: "" }}`)).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";s+=e(await f.split.call(c,c.name,""));return s;})();"`,
    )

    expect(
      await parse('{{= "hello, {name}" | t: name="IJK" }}'),
    ).toMatchInlineSnapshot(
      `""use strict";return(async()=>{let s="";s+=e(await f.t.call(c,"hello, {name}",{name:"IJK"}));return s;})();"`,
    )
  })
})

it('whitespace control', async () => {
  expect(await parse(' {{= x }} ')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=" ";s+=e(c.x);s+=" ";return s;})();"`,
  )

  expect(await parse(' {{=- x -}} ')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=" {{=- x -}} ";return s;})();"`,
  )

  expect(await parse(' {{=- x }} ')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=" {{=- x }} ";return s;})();"`,
  )

  expect(await parse(' {{= x -}} ')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=" ";s+=e(c.x);return s;})();"`,
  )

  expect(await parse(' 	{{= x }}	 ')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=" 	";s+=e(c.x);s+="	 ";return s;})();"`,
  )

  expect(await parse(' 	{{=- x -}}	 ')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=" 	{{=- x -}}	 ";return s;})();"`,
  )

  expect(await parse(' 	{{=- x }}	 ')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=" 	{{=- x }}	 ";return s;})();"`,
  )

  expect(await parse(' 	{{= x -}}	 ')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=" 	";s+=e(c.x);return s;})();"`,
  )

  expect(await parse(' \t\r\n{{= x }}\r\n\t ')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=" 	\\n\\n";s+=e(c.x);s+="\\n\\n	 ";return s;})();"`,
  )

  expect(await parse(' \t\r\n{{=- x -}}\r\n\t ')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=" 	\\n\\n{{=- x -}}\\n\\n	 ";return s;})();"`,
  )

  expect(await parse(' \t\r\n{{=- x }}\r\n\t ')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=" 	\\n\\n{{=- x }}\\n\\n	 ";return s;})();"`,
  )

  expect(await parse(' \t\r\n{{= x -}}\r\n\t ')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=" 	\\n\\n";s+=e(c.x);return s;})();"`,
  )
})

it('inline if/else', async () => {
  expect(await parse(`{{= "x" if level else "y" }}`)).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=e(c.level ? "x" : "y");return s;})();"`,
  )

  expect(await parse(`{{= "x" if level }}`)).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=e(c.level ? "x" : "");return s;})();"`,
  )

  expect(
    await parse(`{{= "x" | f if level else y | f: a }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=e(c.level ? await f.f.call(c,"x") : await f.f.call(c,c.y,c.a));return s;})();"`,
  )

  expect(await parse(`{{= "md:block" if page.toc }}`)).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=e(c.page.toc ? "md:block" : "");return s;})();"`,
  )

  expect(
    await parse(`{{= "negative" if accounts.length lt 0 else "positive" }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+=e(c.accounts.length<0 ? "negative" : "positive");return s;})();"`,
  )
})

it('invalid', async () => {
  expect(await parse('{{= window }}')).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+="{{= window }}";return s;})();"`,
  )
})
