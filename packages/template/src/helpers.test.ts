import { expect, it } from 'vitest'
import { getIn } from './helpers'

it('getIn', () => {
  expect(getIn({ x: 1 }, 0, 'x')).toBe(1)
  expect(getIn([1], 0, 'x')).toBe(1)
})
