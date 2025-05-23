import { expect, it } from 'vitest'
import { parseExpression as pe } from './parse-expression'

it('basic', () => {
  expect(pe('x')).toEqual({ value: 'x' })
})

it('w/ filter', () => {
  expect(pe('x | abs')).toEqual({
    value: 'x',
    filters: [{ name: 'abs' }],
  })

  expect(pe('x | replace: "a", "," | split: ""')).toEqual({
    value: 'x',
    filters: [
      {
        name: 'replace',
        args: '"a", ","',
      },
      {
        name: 'split',
        args: '""',
      },
    ],
  })
})

it('ternary conditional', () => {
  expect(pe('x ? x : "x"')).toEqual({
    value: 'x ? x : "x"',
  })
})

it('||', () => {
  expect(pe('x||y')).toEqual({
    value: 'x||y',
  })
  expect(pe('x || y')).toEqual({
    value: 'x || y',
  })
})

it('arithmetic', () => {
  ['+', '-', '*', '/', '%'].forEach((op) => {
    expect(pe(`1 ${op} 2`)).toEqual({ value: `1 ${op} 2` })
    expect(pe(`1${op}2`)).toEqual({ value: `1${op}2` })
    expect(pe(`x ${op} y`)).toEqual({ value: `x ${op} y` })
    expect(pe(`x${op}y`)).toEqual({ value: `x${op}y` })
    expect(pe(`x${op}"y"`)).toEqual({ value: `x${op}"y"` })
    expect(pe(`x${op}1`)).toEqual({ value: `x${op}1` })
    expect(pe(`1${op}y`)).toEqual({ value: `1${op}y` })
  })

  expect(pe(`x++`)).toEqual({ value: `x++` })
  expect(pe(`++x`)).toEqual({ value: `++x` })
  expect(pe(`+x`)).toEqual({ value: `+x` })
  expect(pe(`x--`)).toEqual({ value: `x--` })
  expect(pe(`--x`)).toEqual({ value: `--x` })
  expect(pe(`-x`)).toEqual({ value: `-x` })

  const filters = [{ name: 'f', args: undefined }]
  expect(pe(`x++ | f`)).toEqual({ value: `x++`, filters })
  expect(pe(`++x | f`)).toEqual({ value: `++x`, filters })
  expect(pe(`+x | f`)).toEqual({ value: `+x`, filters })
  expect(pe(`x-- | f`)).toEqual({ value: `x--`, filters })
  expect(pe(`--x | f`)).toEqual({ value: `--x`, filters })
  expect(pe(`-x | f`)).toEqual({ value: `-x`, filters })
})
