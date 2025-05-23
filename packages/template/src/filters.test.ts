import { describe, expect, test } from 'vitest';
import { Engine } from './engine';
import { render } from '../test/__helper';

describe('builtin', () => {
  test('abs', async () => {
    expect(
      await render('{{ x | abs }}', {
        x: 'foo',
      }),
    ).toMatchInlineSnapshot(`"NaN"`);
    expect(
      await render('{{ x | abs }}', {
        x: -Infinity,
      }),
    ).toMatchInlineSnapshot(`"Infinity"`);
    expect(await render('{{ x | abs }}', { x: -3 })).toMatchInlineSnapshot(
      `"3"`,
    );
  });

  test('add', async () => {
    expect(
      await render('{{ x | add y }}', { x: 1, y: 2 }),
    ).toMatchInlineSnapshot(`"3"`);
  });

  test('capitalize', async () => {
    expect(
      await render('{{ x | capitalize }}', { x: 'foo' }),
    ).toMatchInlineSnapshot(`"Foo"`);
    expect(
      await render('{{ x | capitalize }}', { x: 'foo bar' }),
    ).toMatchInlineSnapshot(`"Foo Bar"`);
  });

  test('date', async () => {
    expect(
      await render('{{ x | date }}', { x: '2021-01-01' }),
    ).toMatchInlineSnapshot(`"2021-01-01 00:00"`);
    expect(
      await render('{{ x | date "y-M-d" }}', { x: '2021-01-01' }),
    ).toMatchInlineSnapshot(`"2021-1-1"`);
    expect(
      await render('{{ x | time "N" }}', { x: '2021-01-01' }),
    ).toMatchInlineSnapshot(`"Jan"`);
    expect(
      await render('{{ x | time "NN" }}', { x: '2021-01-01' }),
    ).toMatchInlineSnapshot(`"January"`);
  });

  test('entries', async () => {
    expect(
      await render('{{ x | entries }}', {
        x: { foo: 1, bar: 2 },
      }),
    ).toMatchInlineSnapshot(`"foo,1,bar,2"`);
  });

  test('escape', async () => {
    expect(
      await render('{{ x }}', {
        x: '&<>\'"',
      }),
    ).toMatchInlineSnapshot(`"&amp;&lt;&gt;&#39;&#34;"`);
    expect(
      await render(
        '{{ x }}',
        {
          x: '&<>\'"',
        },
        { autoEscape: false },
      ),
    ).toMatchInlineSnapshot(`"&<>'""`);
    expect(
      await render('{{ x | escape }}', { x: '&<>\'"' }, { autoEscape: false }),
    ).toMatchInlineSnapshot(`"&amp;&lt;&gt;&#39;&#34;"`);
  });

  test('even', async () => {
    expect(await render('{{ x | even }}', { x: 2 })).toMatchInlineSnapshot(
      `"true"`,
    );
  });

  test('fallback', async () => {
    expect(
      await render('{{ x | fallback y }}', { x: 0, y: 2 }),
    ).toMatchInlineSnapshot(`"2"`);
    expect(
      await render('{{ o.x | fallback o.y }}', { o: { x: 0, y: 2 } }),
    ).toMatchInlineSnapshot(`"2"`);
  });

  test('first', async () => {
    expect(await render('{{ x | first }}', { x: 'foo' })).toMatchInlineSnapshot(
      `"f"`,
    );
    expect(
      await render('{{ x | first }}', { x: ['foo', 'bar'] }),
    ).toMatchInlineSnapshot(`"foo"`);
  });

  test('groupby', async () => {
    expect(
      await render('{{ a | groupby "k" | json }}', {
        a: [
          { k: 'foo', v: 1 },
          { k: 'bar', v: 2 },
          { k: 'foo', v: 3 },
          { k: 'bar', v: 4 },
        ],
      }),
    ).toMatchInlineSnapshot(
      `"{"foo":[{"k":"foo","v":1},{"k":"foo","v":3}],"bar":[{"k":"bar","v":2},{"k":"bar","v":4}]}"`,
    );
    expect(
      await render('{{ a | groupby k | json }}', {
        k: 'k',
        a: [
          { k: 'foo', v: 1 },
          { k: 'bar', v: 2 },
          { k: 'foo', v: 3 },
          { k: 'bar', v: 4 },
        ],
      }),
    ).toMatchInlineSnapshot(
      `"{"foo":[{"k":"foo","v":1},{"k":"foo","v":3}],"bar":[{"k":"bar","v":2},{"k":"bar","v":4}]}"`,
    );
  });

  test('join', async () => {
    expect(
      await render('{{ x | join "-" }}', { x: ['foo', 'bar'] }),
    ).toMatchInlineSnapshot(`"foo-bar"`);
  });

  test('json', async () => {
    expect(
      await render('{{ x | json }}', { x: { foo: '<bar>' } }),
    ).toMatchInlineSnapshot(`"{"foo":"<bar>"}"`);
    expect(await render('{{ x | json 2 }}', { x: { foo: '<bar>' } }))
      .toMatchInlineSnapshot(`
      "{
        "foo": "<bar>"
      }"
    `);
  });

  test('keys', async () => {
    expect(
      await render('{{ x | keys }}', { x: { foo: 1, bar: 2 } }),
    ).toMatchInlineSnapshot(`"foo,bar"`);
  });

  test('last', async () => {
    expect(await render('{{ x | last }}', { x: 'foo' })).toMatchInlineSnapshot(
      `"o"`,
    );
    expect(
      await render('{{ x | last }}', { x: ['foo', 'bar'] }),
    ).toMatchInlineSnapshot(`"bar"`);
  });

  test('length', async () => {
    expect(
      await render('{{ x | length }}', { x: 'foo' }),
    ).toMatchInlineSnapshot(`"3"`);
  });

  test('lower', async () => {
    expect(await render('{{ x | lower }}', { x: 'FOO' })).toMatchInlineSnapshot(
      `"foo"`,
    );
  });

  test('map', async () => {
    expect(
      await render('{{ a | map "a" }}', {
        a: [{ a: 1 }, {}, { a: 3 }],
      }),
    ).toMatchInlineSnapshot(`"1,,3"`);
    expect(
      await render('{{ a | map "a" -1 }}', {
        a: [{ a: 1 }, {}, { a: 3 }],
      }),
    ).toMatchInlineSnapshot(`"1,-1,3"`);
  });

  test('max', async () => {
    expect(
      await render('{{ x | max y z }}', { x: 1, y: 2, z: 3 }),
    ).toMatchInlineSnapshot(`"3"`);
  });

  test('min', async () => {
    expect(
      await render('{{ x | min y z }}', { x: 1, y: 2, z: 3 }),
    ).toMatchInlineSnapshot(`"1"`);
  });

  test('minus', async () => {
    expect(
      await render('{{ x | minus y }}', { x: 1, y: 2 }),
    ).toMatchInlineSnapshot(`"-1"`);
  });

  test('odd', async () => {
    expect(await render('{{ x | odd }}', { x: 1 })).toMatchInlineSnapshot(
      `"true"`,
    );
  });

  test('omit', async () => {
    expect(
      await render('{{ o | omit "y" "z" | json }}', {
        o: { x: 1, y: 2, z: 3 },
      }),
    ).toMatchInlineSnapshot(`"{"x":1}"`);
  });

  test('pick', async () => {
    expect(
      await render('{{ o | pick "y" "z" | json }}', {
        o: { x: 1, y: 2, z: 3 },
      }),
    ).toMatchInlineSnapshot(`"{"y":2,"z":3}"`);
  });

  test('repeat', async () => {
    expect(
      await render('{{ x | repeat 2 }}', { x: 'foo' }),
    ).toMatchInlineSnapshot(`"foofoo"`); // cspell: disable-line
  });

  test('replace', async () => {
    expect(
      await render('{{ x | replace "o" "a" }}', { x: 'foo' }),
    ).toMatchInlineSnapshot(`"faa"`);
  });

  test('reverse', async () => {
    expect(
      await render('{{ x | reverse }}', { x: 'foo' }),
    ).toMatchInlineSnapshot(`"oof"`);
    expect(
      await render('{{ x | reverse }}', { x: ['foo', 'bar'] }),
    ).toMatchInlineSnapshot(`"bar,foo"`);
  });

  test('safe', async () => {
    expect(await render('{{ x }}', { x: '&<>\'"' })).toMatchInlineSnapshot(
      `"&amp;&lt;&gt;&#39;&#34;"`,
    );
    expect(
      await render('{{ x | safe }}', { x: '&<>\'"' }),
    ).toMatchInlineSnapshot(`"&<>'""`);
  });

  test('slice', async () => {
    expect(
      await render('{{ x | slice 1 }}', { x: 'foo' }),
    ).toMatchInlineSnapshot(`"oo"`);
    expect(
      await render('{{ x | slice 1 2 }}', { x: 'foo' }),
    ).toMatchInlineSnapshot(`"o"`);
  });

  test('sort', async () => {
    expect(await render('{{ x | sort }}', { x: 'bar' })).toMatchInlineSnapshot(
      `"abr"`,
    );
    expect(
      await render('{{ x | sort }}', { x: ['foo', 'bar'] }),
    ).toMatchInlineSnapshot(`"bar,foo"`);
  });

  test('split', async () => {
    expect(
      await render('{{ x | split "," }}', { x: 'foo,bar' }),
    ).toMatchInlineSnapshot(`"foo,bar"`);
  });

  test('sum', async () => {
    expect(
      await render('{{ x | sum }}', { x: [1, 2, 3] }),
    ).toMatchInlineSnapshot(`"6"`);
  });

  test('t', async () => {
    expect(
      await render('{{ "hello, {name}" | t name="IJK" }}', {
        translations: { 'hello, {name}': '你好，{name}' },
      }),
    ).toMatchInlineSnapshot(`"你好，IJK"`);
  });

  test('time', async () => {
    expect(
      await render('{{ x | time }}', { x: '2021-01-01' }),
    ).toMatchInlineSnapshot(`"00:00"`);
    expect(
      await render('{{ x | time "D" }}', { x: '2021-01-01' }),
    ).toMatchInlineSnapshot(`"Fri"`);
    expect(
      await render('{{ x | time "DD" }}', { x: '2021-01-01' }),
    ).toMatchInlineSnapshot(`"Friday"`);
  });

  test('trim', async () => {
    expect(
      await render('{{ x | trim }}', { x: ' foo ' }),
    ).toMatchInlineSnapshot(`"foo"`);
  });

  test('unique', async () => {
    expect(
      await render('{{ x | unique }}', { x: 'foo' }),
    ).toMatchInlineSnapshot(`"fo"`);
    expect(
      await render('{{ x | unique }}', { x: ['foo', 'foo', 'bar'] }),
    ).toMatchInlineSnapshot(`"foo,bar"`);
  });

  test('upper', async () => {
    expect(await render('{{ x | upper }}', { x: 'foo' })).toMatchInlineSnapshot(
      `"FOO"`,
    );
  });

  test('values', async () => {
    expect(
      await render('{{ x | values }}', {
        x: { foo: 1, bar: 2 },
      }),
    ).toMatchInlineSnapshot(`"1,2"`);
  });
});

describe('custom', () => {
  test('_camel', async () => {
    expect(
      await (
        await new Engine({ debug: true })
          .registerFilters({
            _camel: (value: string) =>
              value.replace(/-(\w)/g, (_, c) => c.toUpperCase()),
          })
          .compile('{{ x | _camel }}')
      ).render({ x: 'foo-bar' }),
    ).toMatchInlineSnapshot(`"fooBar"`);
  });

  test('_async', async () => {
    expect(
      await (
        await new Engine({ debug: true })
          .registerFilters({ _async: async (value: string) => value })
          .compile('{{ x | _async }}')
      ).render({ x: 'foo-bar' }),
    ).toMatchInlineSnapshot(`"foo-bar"`);
  });
});
