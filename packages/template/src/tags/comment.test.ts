import { describe, expect, test } from 'vitest';
import { parse } from '../../test/__helper';

test('basic', async () => {
  expect(await parse('{{ ! foo }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";return s;})();"`,
  );

  expect(await parse('{{ #foo #}}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+="{{ #foo #}}";return s;})();"`,
  );

  expect(await parse('{{ #comment }}foo{{ /comment }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";return s;})();"`,
  );
});

test('multiline', async () => {
  expect(await parse('{{ ! foo\nbar }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";return s;})();"`,
  );

  expect(await parse('{{ #foo\nbar #}}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+="{{ #foo\\nbar #}}";return s;})();"`,
  );

  expect(
    await parse('{{ #comment }}foo\nbar{{ /comment }}'),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";return s;})();"`,
  );
});

describe('w/o stripComments', async () => {
  test('basic', async () => {
    expect(
      await parse('{{ ! foo }}', {
        stripComments: false,
      }),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+="<!--foo-->";return s;})();"`,
    );

    expect(
      await parse('{{ #foo #}}', { stripComments: false }),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+="{{ #foo #}}";return s;})();"`,
    );

    expect(
      await parse('{{ #comment }}foo{{ /comment }}', {
        stripComments: false,
      }),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+="<!--";s+="foo";s+="-->";return s;})();"`,
    );
  });

  test('multiline', async () => {
    expect(
      await parse('{{ ! foo\nbar }}', {
        stripComments: false,
      }),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+="<!--foo\\nbar-->";return s;})();"`,
    );

    expect(
      await parse('{{ #foo\nbar #}}', { stripComments: false }),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+="{{ #foo\\nbar #}}";return s;})();"`,
    );

    expect(
      await parse('{{ #comment }}foo\nbar{{ /comment }}', {
        stripComments: false,
      }),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+="<!--";s+="foo\\nbar";s+="-->";return s;})();"`,
    );
  });

  test('escape', async () => {
    expect(
      await parse('{{ ! \\{\\{ escape \\}\\} }}', { stripComments: false }),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+="<!--{{ escape }}-->";return s;})();"`,
    );

    // TODO
    // expect(
    //   await parse('{{ ! \\{\\{ escape \\}\\ }}}', { stripComments: false }),
    // ).toMatchInlineSnapshot(
    // );

    expect(
      await parse('{{ ! {{ escape }}}}', { stripComments: false }),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+="<!--{{ escape-->";s+="}}";return s;})();"`,
    );
    expect(
      await parse('{{ ! escape }}', { stripComments: false }),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+="<!--escape-->";return s;})();"`,
    );
    expect(
      await parse('{{ #\\{\\{ escape \\}\\} #}}', { stripComments: false }),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+="{{ #{{ escape }} #}}";return s;})();"`,
    );
    expect(
      await parse('{{ #{{ escape }} #}}', { stripComments: false }),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e("{{ #{{ escape }}");s+=" #}}";return s;})();"`,
    );
    expect(
      await parse('{{ #escape #}}', { stripComments: false }),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+="{{ #escape #}}";return s;})();"`,
    );
    expect(
      await parse('{{ ! {\\{ escape }\\ }}}', { stripComments: false }),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+="<!--{{ escape }\\\\-->";s+="}";return s;})();"`,
    );
    expect(
      await parse('{{ ! {{ escape }}}}', { stripComments: false }),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+="<!--{{ escape-->";s+="}}";return s;})();"`,
    );
    expect(
      await parse('{{ ! escape }}', { stripComments: false }),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+="<!--escape-->";return s;})();"`,
    );
    expect(
      await parse('{{ #{\\{ escape }\\} #}}', { stripComments: false }),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+="{{ #{{ escape }} #}}";return s;})();"`,
    );
    expect(
      await parse('{{ #{{ escape }} #}}', { stripComments: false }),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+=e("{{ #{{ escape }}");s+=" #}}";return s;})();"`,
    );
    expect(
      await parse('{{ #escape #}}', { stripComments: false }),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+="{{ #escape #}}";return s;})();"`,
    );
    expect(
      await parse('{{ #comment }}foo\n{{ name }}\nbar{{ /comment }}', {
        stripComments: false,
      }),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+="<!--";s+="foo\\n";s+=e(c.name);s+="\\nbar";s+="-->";return s;})();"`,
    );
    expect(
      await parse('{{ #comment }}foo\n\\{\\{ name \\}\\}\nbar{{ /comment }}', {
        stripComments: false,
      }),
    ).toMatchInlineSnapshot(
      `""use strict";return (async ()=>{let s="";s+="<!--";s+="foo\\n{{ name }}\\nbar";s+="-->";return s;})();"`,
    );
  });
});
