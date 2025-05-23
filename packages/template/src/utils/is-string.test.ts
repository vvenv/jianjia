/* eslint-disable style/no-tabs */
import { expect, it } from 'vitest'
import { isString } from './is-string'

it('basic', () => {
  expect(isString(`''`)).toBe(true)
  expect(isString(`""`)).toBe(true)
  expect(isString('``')).toBe(true)
  expect(isString(`'""'`)).toBe(true)
  expect(isString(`"''"`)).toBe(true)
  expect(isString('`""`')).toBe(true)
  expect(isString(`'\\''`)).toBe(true)
  expect(isString(`"\\""`)).toBe(true)
  expect(isString('`\\``')).toBe(true)
  expect(isString(`'a'`)).toBe(true)
  expect(isString(`"a"`)).toBe(true)
  expect(isString('`a`')).toBe(true)
  expect(isString('"new\nline"')).toBe(true)
  expect(isString('\'	tab	\'')).toBe(true)
  expect(isString('true')).toBe(false)
  expect(isString('false')).toBe(false)
  expect(isString('null')).toBe(false)
  expect(isString('undefined')).toBe(false)
})
