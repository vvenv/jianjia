import { expect, it } from 'vitest'
import { template } from '.'

it('template', async () => {
  expect(await template('{{= name }}', { name: 'foo' })).toMatchInlineSnapshot(
    `"foo"`,
  )
})
