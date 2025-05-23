import { expect, it } from 'vitest'
import { parseFilter } from './parse-filter'

it('basic', () => {
  expect(parseFilter('abs')).toEqual({ name: 'abs' })
})

it('name and args', () => {
  expect(parseFilter('replace: "a", b.c')).toEqual({
    name: 'replace',
    args: '"a", b.c',
  })
  expect(parseFilter('replace: ":", "-"')).toEqual({
    name: 'replace',
    args: '":", "-"',
  })
  expect(parseFilter('replace: a=a, b="b"')).toEqual({
    name: 'replace',
    args: 'a=a, b="b"',
  })
  expect(parseFilter('t: b="b"')).toEqual({
    name: 't',
    args: 'b="b"',
  })
})
