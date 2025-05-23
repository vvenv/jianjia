import { describe, expect, test } from 'vitest';
import { parse } from '../../test/__helper';

test('basic', async () => {
  expect(await parse('{{ x }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e(c.x);return s;})();"`,
  );
});

test('nesting', async () => {
  expect(await parse('{{ x }}{{ x.y }}{{ x.y.z }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e(c.x);s+=e(c.x.y);s+=e(c.x.y.z);return s;})();"`,
  );
});

test('arithmetic', async () => {
  expect(
    await parse('{{ x+2 }}{{ x-2 }}{{ x*2 }}{{ x/2 }}{{ x**2 }}{{ x%2 }}'),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e(c.x+2);s+=e(c.x-2);s+=e(c.x*2);s+=e(c.x/2);s+=e(c.x**2);s+=e(c.x%2);return s;})();"`,
  );

  expect(
    await parse('{{ 2+x }}{{ 2-x }}{{ 2*x }}{{ 2/x }}{{ 2**x }}{{ 2%x }}'),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e(2+c.x);s+=e(2-c.x);s+=e(2*c.x);s+=e(2/c.x);s+=e(2**c.x);s+=e(2%c.x);return s;})();"`,
  );

  expect(await parse('{{ x++ }}{{ ++x }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e(c.x++);s+=e(++c.x);return s;})();"`,
  );

  expect(await parse('{{ x-- }}{{ --x }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e(c.x--);s+=e(--c.x);return s;})();"`,
  );
});

test('ternary conditional', async () => {
  expect(await parse(`{{ x ? x : "x" }}`)).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e("{{ x ? x : \\"x\\" }}");return s;})();"`,
  );
});

test('array/object member', async () => {
  expect(
    await parse('{{ x[2] }}{{ y["foo"] }}{{ z.bar }}'),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e(c.x[2]);s+=e(c.y["foo"]);s+=e(c.z.bar);return s;})();"`,
  );

  expect(await parse('{{ [1,2,3][4][5] }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e("{{ [1,2,3][4][5] }}");return s;})();"`,
  );

  expect(await parse('{{ ["1","2","3"]["4"]["5"] }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e("{{ [\\"1\\",\\"2\\",\\"3\\"][\\"4\\"][\\"5\\"] }}");return s;})();"`,
  );

  expect(
    await parse('{{ config.locales[page.locale]["lang"] }}'),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e(c.config.locales[c.page.locale]["lang"]);return s;})();"`,
  );

  // not supported
  // expect(await parse('{{ config.locales[page.locale].lang }}')).toMatchInlineSnapshot();
});

test('escape', async () => {
  expect(await parse('{{ "\\{\\{ escape \\}\\}" }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e("{{ escape }}");return s;})();"`,
  );

  expect(await parse('{{ "{\\{ escape }\\}" }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e("{{ escape }}");return s;})();"`,
  );

  expect(await parse('{{ "\\{{ escape \\ }}" }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e("{{ \\"\\\\{{ escape \\\\ }}");s+="\\" }}";return s;})();"`,
  );

  expect(await parse('{{ {{ escape }} }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e("{{ {{ escape }}");s+=" }}";return s;})();"`,
  );

  expect(await parse('{{ {{ escape } }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e("{{ {{ escape } }}");return s;})();"`,
  );

  expect(await parse('{{ { escape }} }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e("{{ { escape }}");s+=" }}";return s;})();"`,
  );

  expect(await parse('{{ { escape } }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e("{{ { escape } }}");return s;})();"`,
  );

  expect(await parse('{{ escape }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e(c.escape);return s;})();"`,
  );
});

describe('literal', () => {
  test('string', async () => {
    expect(await parse('{{ "*" }}')).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e("*");return s;})();"`,
    );

    expect(await parse('{{ "**" }}')).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e("**");return s;})();"`,
    );

    expect(await parse('{{ "***" }}')).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e("***");return s;})();"`,
    );

    expect(await parse('{{ "\\"*" }}')).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e("\\"*");return s;})();"`,
    );
  });

  test('number', async () => {
    expect(await parse('{{ 1314 }}')).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e(1314);return s;})();"`,
    );

    expect(await parse('{{ 13.14 }}')).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e(13.14);return s;})();"`,
    );
  });

  test('boolean', async () => {
    expect(await parse('{{ true }}')).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e(true);return s;})();"`,
    );

    expect(await parse('{{ false }}')).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e(false);return s;})();"`,
    );
  });

  test('array', async () => {
    expect(await parse('{{ [1, "1"] }}')).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e([1, "1"]);return s;})();"`,
    );
  });

  test('object', async () => {
    expect(await parse('{{ { x: 1 } }}')).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e("{{ { x: 1 } }}");return s;})();"`,
    );

    expect(await parse('{{ { x: 1 } }}')).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e("{{ { x: 1 } }}");return s;})();"`,
    );
  });

  test('regexp', async () => {
    expect(await parse('{{ /\\d+/ }}')).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e("{{ /\\\\d+/ }}");return s;})();"`,
    );

    expect(await parse('{{ /{{ .+? }}/gms }}')).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e("{{ /{{ .+? }}");s+="/gms }}";return s;})();"`,
    );
  });
});

describe('w/ filters', async () => {
  test('basic', async () => {
    expect(await parse('{{ x | upper }}')).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e(await f.upper.call(c,c.x));return s;})();"`,
    );

    expect(await parse('{{ "x" | upper }}')).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e(await f.upper.call(c,"x"));return s;})();"`,
    );

    expect(await parse("{{ 'x' | upper }}")).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e(await f.upper.call(c,'x'));return s;})();"`,
    );

    expect(await parse('{{ `x` | upper }}')).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e(await f.upper.call(c,\`x\`));return s;})();"`,
    );
  });

  test('multiple', async () => {
    expect(await parse('{{ x | upper | lower }}')).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e(await f.lower.call(c,await f.upper.call(c,c.x)));return s;})();"`,
    );
  });

  test('duo', async () => {
    expect(
      await parse('{{ x | upper }} and {{ x | upper }}'),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e(await f.upper.call(c,c.x));s+=" and ";s+=e(await f.upper.call(c,c.x));return s;})();"`,
    );
  });

  test('safe', async () => {
    expect(await parse('{{ x | safe }}')).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e(await f.safe.call(c,c.x));return s;})();"`,
    );
  });

  test('w/ args', async () => {
    expect(await parse(`{{ name | split "" }}`)).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e(await f.split.call(c,c.name,""));return s;})();"`,
    );

    expect(
      await parse('{{ "hello, {name}" | t name="IJK" }}'),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e(await f.t.call(c,"hello, {name}",{name:"IJK"}));return s;})();"`,
    );
  });
});

test('whitespace control', async () => {
  expect(await parse(' {{ x }} ')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=" ";s+=e(c.x);s+=" ";return s;})();"`,
  );

  expect(await parse(' {{- x -}} ')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e(c.x);return s;})();"`,
  );

  expect(await parse(' {{- x }} ')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e(c.x);s+=" ";return s;})();"`,
  );

  expect(await parse(' {{ x -}} ')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=" ";s+=e(c.x);return s;})();"`,
  );

  expect(await parse(' 	{{ x }}	 ')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=" 	";s+=e(c.x);s+="	 ";return s;})();"`,
  );

  expect(await parse(' 	{{- x -}}	 ')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e(c.x);return s;})();"`,
  );

  expect(await parse(' 	{{- x }}	 ')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e(c.x);s+="	 ";return s;})();"`,
  );

  expect(await parse(' 	{{ x -}}	 ')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=" 	";s+=e(c.x);return s;})();"`,
  );

  expect(await parse(' \t\r\n{{ x }}\r\n\t ')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=" 	\\n\\n";s+=e(c.x);s+="\\n\\n	 ";return s;})();"`,
  );

  expect(await parse(' \t\r\n{{- x -}}\r\n\t ')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e(c.x);return s;})();"`,
  );

  expect(await parse(' \t\r\n{{- x }}\r\n\t ')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e(c.x);s+="\\n\\n	 ";return s;})();"`,
  );

  expect(await parse(' \t\r\n{{ x -}}\r\n\t ')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=" 	\\n\\n";s+=e(c.x);return s;})();"`,
  );
});

test('inline if/else', async () => {
  expect(await parse(`{{ "x" if level else "y" }}`)).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e(c.level ? "x" : "y");return s;})();"`,
  );

  expect(await parse(`{{ "x" if level }}`)).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e(c.level ? "x" : "");return s;})();"`,
  );

  expect(await parse(`{{ "x"|f if level else y|f a }}`)).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e("{{ \\"x\\"|f if level else y|f a }}");return s;})();"`,
  );

  expect(await parse(`{{ "md:block" if page.toc }}`)).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e(c.page.toc ? "md:block" : "");return s;})();"`,
  );
});

test('not valid expressions', async () => {
  expect(await parse('{{ x#x }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e("{{ x#x }}");return s;})();"`,
  );

  expect(await parse('{{ x!x }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e("{{ x!x }}");return s;})();"`,
  );
});
