import { expect, test } from 'vitest';
import { template } from '.';

test('template', async () => {
  expect(await template('{{ name }}', { name: 'foo' })).toMatchInlineSnapshot(
    `"foo"`,
  );
});
