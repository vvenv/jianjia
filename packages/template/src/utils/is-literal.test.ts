import { expect, it } from 'vitest'
import { isLiteral } from './is-literal'

it('basic', () => {
  expect(isLiteral('true')).toBe(true)
  expect(isLiteral('false')).toBe(true)
  expect(isLiteral('null')).toBe(true)
  expect(isLiteral('undefined')).toBe(true)
  expect(isLiteral('"a"')).toBe(true)
  expect(isLiteral('1')).toBe(true)
  expect(isLiteral('[]')).toBe(false)
  expect(isLiteral('{}')).toBe(false)
  expect(isLiteral('function() {}')).toBe(false)
  expect(isLiteral('() => {}')).toBe(false)
  expect(isLiteral('someVariable')).toBe(false)
  expect(isLiteral('[1, 2].map(x => x * 2)')).toBe(false)
})
