import { expect, it } from 'vitest'
import { isEvil } from './is-evil'

it('basic', () => {
  expect(isEvil('window.alert')).toBe(true)
  expect(isEvil('alert')).toBe(true)
  expect(isEvil('eval')).toBe(true)
  expect(isEvil('confirm')).toBe(true)
  expect(isEvil('prompt')).toBe(true)
  expect(isEvil('console')).toBe(true)
  expect(isEvil('<')).toBe(true)
  expect(isEvil('>')).toBe(true)
  expect(isEvil('1<')).toBe(false)
  expect(isEvil('>1')).toBe(false)
})
