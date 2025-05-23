import { describe, expect, test } from 'vitest';
import { compile, render } from '../test/__helper';
import { loader } from './loaders/file-loader';

describe('autoEscape', async () => {
  test('enabled', async () => {
    expect(
      await render(
        `"
{{ x }}
<>`,
        { x: '<foo>\t</foo>' },
      ),
    ).toMatchInlineSnapshot(`
      ""
      &lt;foo&gt;	&lt;/foo&gt;
      <>"
    `);
  });

  test('disabled', async () => {
    expect(
      await render(
        `"
{{ x }}
<>`,
        { x: '<foo>\t</foo>' },
        {
          autoEscape: false,
        },
      ),
    ).toMatchInlineSnapshot(`
      ""
      <foo>	</foo>
      <>"
    `);
  });
});

test('interpolate', async () => {
  expect(await render('{{ name }}', { name: 'foo' })).toMatchInlineSnapshot(
    `"foo"`,
  );
  expect(
    await render('{{ name }} and {{ name }}', { name: 'foo' }),
  ).toMatchInlineSnapshot(`"foo and foo"`);
  expect(await render('{{ "*" }}', {})).toMatchInlineSnapshot(`"*"`);
});

test('for loop', async () => {
  expect(
    await render('{{ #for name in names }}{{ name }}{{ /for }}', {
      names: ['foo', 'bar'],
    }),
  ).toMatchInlineSnapshot(`"foobar"`);

  expect(
    await render(
      `{{ #for name in names -}}
  {{ name }}
{{- /for }}`,
      {
        names: ['foo', 'bar'],
      },
    ),
  ).toMatchInlineSnapshot(`"foobar"`);
});

test('for loop - nested', async () => {
  expect(
    await render(
      `{{ #for _as in ass }}{{ #for a in _as }}|{{ a }} in {{ _as }} in {{ ass }}|{{ /for }}{{ /for }}`,
      {
        ass: ['foo', 'bar'],
      },
    ),
  ).toMatchInlineSnapshot(
    `"|f in foo in foo,bar||o in foo in foo,bar||o in foo in foo,bar||b in bar in foo,bar||a in bar in foo,bar||r in bar in foo,bar|"`,
  );
});

test('if - else', async () => {
  expect(
    await render(`{{ #if name }}{{ name }}{{ else }}{{ "*" }}{{ /if }}`, {
      name: 'foo',
    }),
  ).toMatchInlineSnapshot(`"foo"`);
  expect(
    await render(`{{ #if name }}{{ name }}{{ else }}{{ "*" }}{{ /if }}`, {}),
  ).toMatchInlineSnapshot(`"*"`);
});

test('mixed', async () => {
  expect(
    await render(
      `{{ #for name in names }}{{ #if name }}{{ name }}{{ else }}{{ "*" }}{{ /if }}{{ /for }}`,
      {
        names: ['foo', '', 'bar'],
      },
    ),
  ).toMatchInlineSnapshot(`"foo*bar"`);
});

test('destructing', async () => {
  expect(
    await render(
      `{{ #for name in names }}{{ #for k, v in name }}{{ k }}{{ v }}{{ /for }}{{ /for }}`,
      {
        names: [
          { x: 1, y: 3 },
          { y: 2, x: 4 },
        ],
      },
    ),
  ).toMatchInlineSnapshot(`"x1y3y2x4"`);
});

test('compile error', async () => {
  expect(await compile(`{{ #for name in names }}{{ /if }}`, { debug: true }))
    .toMatchInlineSnapshot(`
      " JianJia  "end_if" must follow "if", not "for".

      1: {{ #for name in names }}{{ /if }}
         ^^^^^^^^^^^^^^^^^^^^^^^^
                                 ^^^^^^^^^
      "
    `);
  expect(await compile(`{{ #for name in names }}{{ /if }}`, { debug: false }))
    .toMatchInlineSnapshot(`
      {
        "render": [Function],
        "script": [Function],
      }
    `);
});

test('render error', async () => {
  expect(
    await render(`{{ #for name in names }}{{ /for }}`, {}, { debug: true }),
  ).toMatchInlineSnapshot(`
    " JianJia  Cannot convert undefined or null to object

    1: {{ #for name in names }}{{ /for }}
       ^^^^^^^^^^^^^^^^^^^^^^^^
    "
  `);
  expect(
    await render(`{{ #for name in names }}{{ /for }}`, {}, { debug: false }),
  ).toMatchInlineSnapshot(`""`);
});

test('partials', async () => {
  expect(
    await render(
      `{{ layout "default" }}`,
      {},
      {
        loader: (path) => loader(`test/${path}`),
      },
    ),
  ).toMatchInlineSnapshot(`
    "<html>
      <head>
      <title>JianJia</title>
      </head>
      <body>
      <h1>Hello, JianJia!</h1>
      </body>
    </html>
    "
  `);

  expect(
    await render(
      `{{ include "header" }}`,
      {},
      {
        loader: (path) => loader(`test/${path}`),
      },
    ),
  ).toMatchInlineSnapshot(`
    "<h1>蒹葭苍苍，白露为霜</h1>
    "
  `);

  expect(
    await render(
      `{{ layout "default" }} x {{ include "header" }} y`,
      {},
      {
        loader: (path) => loader(`test/${path}`),
      },
    ),
  ).toMatchInlineSnapshot(
    `
    "<html>
      <head>
      <title>JianJia</title>
      </head>
      <body>
      <h1>蒹葭苍苍，白露为霜</h1>
      </body>
    </html>
     x 
     y"
  `,
  );
});
