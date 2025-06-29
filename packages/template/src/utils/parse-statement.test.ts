import { expect, it } from 'vitest'
import { operators, parseStatement as pe } from './parse-statement'

it('basic', () => {
  Object.entries(operators).forEach(([alias, op]) => {
    expect(pe(`x ${alias} y`)).toEqual([
      { type: 'expression', value: `x` },
      { type: 'operator', value: op },
      { type: 'expression', value: `y` },
    ])
    expect(pe(`!x ${alias} !y`)).toEqual([
      { type: 'expression', value: `!x` },
      { type: 'operator', value: op },
      { type: 'expression', value: `!y` },
    ])
  })
})

it('w/ filters', () => {
  const filters = [{ name: 'f', args: undefined }]
  Object.entries(operators).forEach(([alias, op]) => {
    expect(pe(`x | f ${alias} y | f`)).toEqual([
      { type: 'expression', value: `x`, filters },
      { type: 'operator', value: op },
      { type: 'expression', value: `y`, filters },
    ])
    expect(pe(`!x | f ${alias} !y | f`)).toEqual([
      { type: 'expression', value: `!x`, filters },
      { type: 'operator', value: op },
      { type: 'expression', value: `!y`, filters },
    ])
  })
})

it('w/ filters w/ args', () => {
  const filters = [{ name: 'f', args: 'a=1' }]
  Object.entries(operators).forEach(([alias, op]) => {
    expect(pe(`x | f: a=1 ${alias} y | f: a=1`)).toEqual([
      { type: 'expression', value: `x`, filters },
      { type: 'operator', value: op },
      { type: 'expression', value: `y`, filters },
    ])
    expect(pe(`!x | f: a=1 ${alias} !y | f: a=1`)).toEqual([
      { type: 'expression', value: `!x`, filters },
      { type: 'operator', value: op },
      { type: 'expression', value: `!y`, filters },
    ])
  })
})

it('not', () => {
  expect(pe(`not x and not y`)).toMatchInlineSnapshot(`
    [
      {
        "type": "expression",
        "value": "not x",
      },
      {
        "type": "operator",
        "value": "&&",
      },
      {
        "type": "expression",
        "value": "not y",
      },
    ]
  `)

  expect(pe(`not x | f: a and not y | f: b="x"`)).toMatchInlineSnapshot(`
    [
      {
        "filters": [
          {
            "args": "a",
            "name": "f",
          },
        ],
        "type": "expression",
        "value": "not x",
      },
      {
        "type": "operator",
        "value": "&&",
      },
      {
        "filters": [
          {
            "args": "b="x"",
            "name": "f",
          },
        ],
        "type": "expression",
        "value": "not y",
      },
    ]
  `)
})

it('inline if/else', () => {
  expect(pe(`"x" if level else "y"`)).toMatchInlineSnapshot(`
    [
      {
        "type": "expression",
        "value": ""x" if level else "y"",
      },
    ]
  `)
})

it('real world', () => {
  // {{ assign x = y and z }}
  expect(pe(`x = y and z`)).toMatchInlineSnapshot(`
    [
      {
        "type": "expression",
        "value": "x",
      },
      {
        "type": "operator",
        "value": "=",
      },
      {
        "type": "expression",
        "value": "y",
      },
      {
        "type": "operator",
        "value": "&&",
      },
      {
        "type": "expression",
        "value": "z",
      },
    ]
  `)

  // {{ assign x, y = z | f a  }}
  expect(pe(`x, y = z | f: a`)).toMatchInlineSnapshot(`
    [
      {
        "type": "expression",
        "value": "x, y",
      },
      {
        "type": "operator",
        "value": "=",
      },
      {
        "filters": [
          {
            "args": "a",
            "name": "f",
          },
        ],
        "type": "expression",
        "value": "z",
      },
    ]
  `)

  // {{ for x, y in z }}
  expect(pe(`x, y in z`)).toMatchInlineSnapshot(`
    [
      {
        "type": "expression",
        "value": "x, y",
      },
      {
        "type": "operator",
        "value": "in",
      },
      {
        "type": "expression",
        "value": "z",
      },
    ]
  `)

  // {{ for x, y in z | f a }}
  expect(pe(`x, y in z | f: a`)).toMatchInlineSnapshot(`
    [
      {
        "type": "expression",
        "value": "x, y",
      },
      {
        "type": "operator",
        "value": "in",
      },
      {
        "filters": [
          {
            "args": "a",
            "name": "f",
          },
        ],
        "type": "expression",
        "value": "z",
      },
    ]
  `)

  expect(pe(`"a" + ","`)).toMatchInlineSnapshot(`
    [
      {
        "type": "expression",
        "value": ""a" + ","",
      },
    ]
  `)

  expect(pe(`x | join: "-" | split: " - "`)).toMatchInlineSnapshot(`
    [
      {
        "filters": [
          {
            "args": ""-"",
            "name": "join",
          },
          {
            "args": "" - "",
            "name": "split",
          },
        ],
        "type": "expression",
        "value": "x",
      },
    ]
  `)

  expect(pe(`"hello, {name}" | t: name="IJK"`)).toMatchInlineSnapshot(`
    [
      {
        "filters": [
          {
            "args": "name="IJK"",
            "name": "t",
          },
        ],
        "type": "expression",
        "value": ""hello, {name}"",
      },
    ]
  `)

  expect(pe(`name in names`)).toMatchInlineSnapshot(`
    [
      {
        "type": "expression",
        "value": "name",
      },
      {
        "type": "operator",
        "value": "in",
      },
      {
        "type": "expression",
        "value": "names",
      },
    ]
  `)

  expect(pe(`x in y`)).toMatchInlineSnapshot(`
    [
      {
        "type": "expression",
        "value": "x",
      },
      {
        "type": "operator",
        "value": "in",
      },
      {
        "type": "expression",
        "value": "y",
      },
    ]
  `)
})
