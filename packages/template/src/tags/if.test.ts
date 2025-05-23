import { describe, expect, test } from 'vitest';
import { parse } from '../../test/__helper';

describe('validation', async () => {
  test('start and end tag mismatched', async () => {
    expect(await parse('{{ #for x in y }}{{ /if }}')).toMatchInlineSnapshot(
      `""`,
    );
    expect(
      await (async () => {
        try {
          await parse('{{ #for x in y }}{{ /if }}', { debug: true });
        } catch (error: any) {
          return error.details;
        }
      })(),
    ).toMatchInlineSnapshot(`undefined`);
    expect(parse('{{ #for x in y }}{{ elif z }}')).toMatchInlineSnapshot(
      `Promise {}`,
    );
    expect(
      await (async () => {
        try {
          await parse('{{ #for x in y }}{{ elif z }}', { debug: true });
        } catch (error: any) {
          return error.details;
        }
      })(),
    ).toMatchInlineSnapshot(`undefined`);
  });
});

test('basic', async () => {
  expect(
    await parse(`{{ #if name }}{{ name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";if(c.name){s+=e(c.name);}return s;})();"`,
  );

  expect(
    await parse(`{{ #if name }}{{ name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";if(c.name){s+=e(c.name);}return s;})();"`,
  );
});

test('not', async () => {
  expect(
    await parse(`{{ #if not name }}{{ name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";if(!c.name){s+=e(c.name);}return s;})();"`,
  );

  expect(
    await parse(`{{ #if !name }}{{ name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";if(!c.name){s+=e(c.name);}return s;})();"`,
  );
});

test('and', async () => {
  expect(
    await parse(`{{ #if x and y }}{{ z }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";if(c.x&&c.y){s+=e(c.z);}return s;})();"`,
  );

  expect(await parse(`{{ #if !x&&y }}{{ z }}{{ /if }}`)).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";if(!c.x&&c.y){s+=e(c.z);}return s;})();"`,
  );
});

test('in', async () => {
  expect(
    await parse(`{{ #if name in names }}{{ name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";if(c.name in c.names){s+=e(c.name);}return s;})();"`,
  );

  expect(
    await parse(`{{ #if name in ["foo", "bar"] }}{{ name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";if(c.name in ["foo", "bar"]){s+=e(c.name);}return s;})();"`,
  );
});

test('equal', async () => {
  expect(
    await parse(`{{ #if name eq other }}{{ name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";if(c.name===c.other){s+=e(c.name);}return s;})();"`,
  );

  expect(
    await parse(`{{ #if name == other }}{{ name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";if(c.name==c.other){s+=e(c.name);}return s;})();"`,
  );

  expect(
    await parse(`{{ #if name === other }}{{ name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";if(c.name===c.other){s+=e(c.name);}return s;})();"`,
  );

  expect(
    await parse(`{{ #if name == "foo" }}{{ name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";if(c.name=="foo"){s+=e(c.name);}return s;})();"`,
  );
});

test('not equal', async () => {
  expect(
    await parse(`{{ #if name ne other }}{{ name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";if(c.name!==c.other){s+=e(c.name);}return s;})();"`,
  );

  expect(
    await parse(`{{ #if name != other }}{{ name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";if(c.name!=c.other){s+=e(c.name);}return s;})();"`,
  );

  expect(
    await parse(`{{ #if name !== other }}{{ name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";if(c.name!==c.other){s+=e(c.name);}return s;})();"`,
  );

  expect(
    await parse(`{{ #if name != "foo" }}{{ name }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";if(c.name!="foo"){s+=e(c.name);}return s;})();"`,
  );
});

test('else', async () => {
  expect(
    await parse(`{{ #if name }}{{ name }}{{ else }}{{ "*" }}{{ /if }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";if(c.name){s+=e(c.name);}else{s+=e("*");}return s;})();"`,
  );
});

test('elif', async () => {
  expect(
    await parse(
      `{{ #if name == "foo" }}>>>{{ elif name == "bar" }}---{{ elif name == "baz" }}...{{ else }}{{ name }}{{ /if }}`,
    ),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";if(c.name=="foo"){s+=">>>";}else if(c.name=="bar"){s+="---";}else if(c.name=="baz"){s+="...";}else{s+=e(c.name);}return s;})();"`,
  );
});

describe('filter', async () => {
  test('basic', async () => {
    expect(
      await parse(`{{ #if name | length }}{{ name }}{{ /if }}`),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";if(await f.length.call(c,c.name)){s+=e(c.name);}return s;})();"`,
    );
  });

  test('multiple', async () => {
    expect(
      await parse(`{{ #if name | length | odd }}{{ name }}{{ /if }}`),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";if(await f.odd.call(c,await f.length.call(c,c.name))){s+=e(c.name);}return s;})();"`,
    );
  });

  test('w/ args', async () => {
    expect(
      await parse(`{{ #if names | join "" == "foobar" }}yes{{ /if }}`),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";if(await f.join.call(c,c.names,"")=="foobar"){s+="yes";}return s;})();"`,
    );
  });
});

test('whitespace control', async () => {
  expect(
    await parse(' hello {{ #if name }} {{ name }} {{ else }} world {{ /if }} '),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=" hello ";if(c.name){s+=" ";s+=e(c.name);s+=" ";}else{s+=" world ";}s+=" ";return s;})();"`,
  );

  expect(
    await parse(
      ' hello {{- #if name -}} {{- name -}} {{- else -}} world {{- /if -}} ',
    ),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=" hello";if(c.name){s+=e(c.name);}else{s+="world";}return s;})();"`,
  );

  expect(
    await parse(
      ' hello {{- #if name }} {{- name }} {{- else }} world {{- /if }} ',
    ),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=" hello";if(c.name){s+=e(c.name);}else{s+=" world";}s+=" ";return s;})();"`,
  );

  expect(
    await parse(
      ' hello {{ #if name -}} {{ name -}} {{ else -}} world {{ /if -}} ',
    ),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=" hello ";if(c.name){s+=e(c.name);}else{s+="world ";}return s;})();"`,
  );
});
