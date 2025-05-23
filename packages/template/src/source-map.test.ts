import { expect, test } from 'vitest';
import { SourceMap } from './source-map';
import { EngineOptions } from './types';

test('mapping', () => {
  const sourcemap = new SourceMap({} as Required<EngineOptions>);
  sourcemap.addMapping(
    {
      startIndex: 0,
      endIndex: 1,
    },
    {
      startIndex: 2,
      endIndex: 3,
    },
  );
  expect(sourcemap.mappings).toMatchInlineSnapshot(`
    [
      {
        "source": {
          "endIndex": 1,
          "startIndex": 0,
        },
        "target": {
          "endIndex": 3,
          "startIndex": 2,
        },
      },
    ]
  `);
  expect(sourcemap.getTags(0)).toMatchInlineSnapshot(`[]`);
  expect(sourcemap.getTags(1)).toMatchInlineSnapshot(`[]`);
  expect(sourcemap.getTags(2)).toMatchInlineSnapshot(`
    [
      {
        "endIndex": 1,
        "startIndex": 0,
      },
    ]
  `);
  expect(sourcemap.getTags(3)).toMatchInlineSnapshot(`
    [
      {
        "endIndex": 1,
        "startIndex": 0,
      },
    ]
  `);
  expect(sourcemap.getTags(4)).toMatchInlineSnapshot(`[]`);
});
