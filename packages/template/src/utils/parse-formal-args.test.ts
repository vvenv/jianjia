import { expect, it } from 'vitest'
import { parseFormalArgs } from './parse-formal-args'

it('basic', () => {
  expect(parseFormalArgs('a')).toEqual(['a'])
})

it('multiple', () => {
  expect(parseFormalArgs('a, a')).toEqual(['a', 'a'])
  expect(parseFormalArgs('a, b')).toEqual(['a', 'b'])
})

it('default args', () => {
  expect(parseFormalArgs('a="foo"')).toEqual(['a="foo"'])
  expect(parseFormalArgs('a="foo", b=`bar`, c=123')).toEqual([
    'a="foo"',
    'b=`bar`',
    'c=123',
  ])
  expect(parseFormalArgs('a=", "')).toEqual(['a=", "'])
  expect(parseFormalArgs('a=", ", b=`, `, c=123')).toEqual([
    'a=", "',
    'b=`, `',
    'c=123',
  ])
})
