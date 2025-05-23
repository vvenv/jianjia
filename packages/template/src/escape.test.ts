import { expect, it } from 'vitest'
import { escape } from './escape'

it('escape &, ", and \'', () => {
  expect(escape('&"\'')).toMatchInlineSnapshot(`"&amp;&#34;&#39;"`)
})
