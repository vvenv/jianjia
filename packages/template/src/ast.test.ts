import { describe, expect, it } from 'vitest'
import { AST } from './ast'
import { defaultOptions } from './engine'
import { namedTags, unnamedTags } from './tags'

expect.addSnapshotSerializer({
  serialize: () => 'AST',
  test: val => val instanceof AST,
})

it('empty', () => {
  const tree = new AST({})

  expect(tree.valid).toBe(true)
  expect(tree.children).toMatchInlineSnapshot(`[]`)

  tree.start({
    name: 'root',
    startIndex: 0,
    endIndex: 0,
  })
  expect(tree.valid).toBe(false)
  expect(tree.children).toMatchInlineSnapshot(`[]`)

  tree.end({
    name: 'end_root',
    startIndex: 0,
    endIndex: 0,
  })
  expect(tree.valid).toBe(true)
  expect(tree.children).toMatchInlineSnapshot(`[]`)
})

it('add tags', () => {
  const ast = new AST({})

  let i = 0

  expect(ast.valid).toBe(true)
  expect(ast.children).toMatchInlineSnapshot(`[]`)

  ast.start({
    name: 'root',
    startIndex: i++,
    endIndex: i++,
  })
  expect(ast.valid).toBe(false)

  ast.start({
    name: 'if',
    startIndex: i++,
    endIndex: i++,
    data: 'x',
  })
  expect(ast.valid).toBe(false)

  ast.end({
    name: 'end_if',
    startIndex: i++,
    endIndex: i++,
  })
  expect(ast.valid).toBe(false)

  ast.start({
    name: 'if',
    startIndex: i++,
    endIndex: i++,
    data: 'x',
  })
  expect(ast.valid).toBe(false)

  ast.between({
    name: 'elif',
    startIndex: i,
    endIndex: i,
    data: 'y',
  })
  expect(ast.valid).toBe(false)

  ast.between({
    name: 'else',
    startIndex: i++,
    endIndex: i++,
  })
  expect(ast.valid).toBe(false)

  ast.start({
    name: 'if',
    startIndex: i,
    endIndex: i,
    data: 'z',
  })
  expect(ast.valid).toBe(false)

  ast.start({
    name: 'if',
    startIndex: i++,
    endIndex: i++,
    data: 'x',
  })
  expect(ast.valid).toBe(false)

  ast.end({
    name: 'end_if',
    startIndex: i++,
    endIndex: i++,
  })
  expect(ast.valid).toBe(false)

  ast.end({
    name: 'end_if',
    startIndex: i++,
    endIndex: i++,
  })
  expect(ast.valid).toBe(false)

  ast.end({
    name: 'end_if',
    startIndex: i++,
    endIndex: i++,
  })
  expect(ast.valid).toBe(false)

  ast.end({
    name: 'end_root',
    startIndex: i++,
    endIndex: i++,
  })
  expect(ast.valid).toBe(true)
})

describe('validation', () => {
  it('unexpected end_if tag', () => {
    const ast = new AST({})

    ast.end({
      name: 'end_if',
      startIndex: 0,
      endIndex: 1,
    })
    expect(ast.valid).toBe(true)
    expect(ast.children).toMatchInlineSnapshot(`[]`)
  })

  it('unexpected else tag', () => {
    const ast = new AST({})

    ast.between({
      name: 'else',
      startIndex: 0,
      endIndex: 1,
    })
    expect(ast.valid).toBe(true)
    expect(ast.children).toMatchInlineSnapshot(`[]`)
  })

  it('unexpected next tag', () => {
    const ast = new AST({})

    ast.start({
      name: 'raw',
      startIndex: 0,
      endIndex: 1,
    })
    ast.nextTag = 'end_raw'
    ast.end({
      name: 'for',
      startIndex: 2,
      endIndex: 3,
    })
    expect(ast.valid).toBe(false)
    expect(ast.tags).toMatchInlineSnapshot(`
      [
        {
          "children": [],
          "endIndex": 1,
          "name": "raw",
          "next": null,
          "nextSibling": null,
          "node": AST,
          "previous": null,
          "previousSibling": null,
          "startIndex": 0,
        },
      ]
    `)
  })

  it('unexpected next tag 2', () => {
    const ast = new AST({})

    ast.start({
      name: 'raw',
      startIndex: 0,
      endIndex: 1,
    })
    ast.nextTag = 'end_raw'
    ast.between({
      name: 'for',
      startIndex: 2,
      endIndex: 3,
    })
    expect(ast.valid).toBe(false)
    expect(ast.tags).toMatchInlineSnapshot(`
      [
        {
          "children": [],
          "endIndex": 1,
          "name": "raw",
          "next": null,
          "nextSibling": null,
          "node": AST,
          "previous": null,
          "previousSibling": null,
          "startIndex": 0,
        },
      ]
    `)
  })
})

describe('validation w/ debug', () => {
  it('unexpected end_if tag', () => {
    try {
      const ast = new AST({ debug: true })

      ast.end({
        name: 'end_if',
        startIndex: 0,
        endIndex: 1,
      })
    }
    catch (error) {
      expect(error).toMatchInlineSnapshot(`[]`)
    }
  })

  it('unexpected else tag', () => {
    try {
      const ast = new AST({ debug: true })

      ast.between({
        name: 'else',
        startIndex: 0,
        endIndex: 1,
      })
    }
    catch (error) {
      expect(error).toMatchInlineSnapshot(`[]`)
    }
  })

  it('unexpected next tag', () => {
    try {
      const ast = new AST({ debug: true })

      ast.start({
        name: 'raw',
        startIndex: 0,
        endIndex: 1,
      })
      ast.nextTag = 'end_raw'
      ast.end({
        name: 'for',
        startIndex: 2,
        endIndex: 3,
      })
    }
    catch (error) {
      expect(error).toMatchInlineSnapshot(
        `[ASTError: expect "end_raw", "for" found.]`,
      )
    }
  })

  it('unexpected next tag 2', () => {
    try {
      const ast = new AST({ debug: true })

      ast.start({
        name: 'raw',
        startIndex: 0,
        endIndex: 1,
      })
      ast.nextTag = 'end_raw'
      ast.between({
        name: 'for',
        startIndex: 2,
        endIndex: 3,
      })
    }
    catch (error) {
      expect(error).toMatchInlineSnapshot(
        `[ASTError: expect "end_raw", "for" found.]`,
      )
    }
  })
})

describe('verify', () => {
  it('checkStartTag', () => {
    const ast = new AST({})
    const tags = [
      { name: 'for', startIndex: 0, endIndex: 1 },
      { name: 'end_if', startIndex: 2, endIndex: 3 },
      { name: 'end_for', startIndex: 4, endIndex: 5 },
    ]
    ast.start(tags[0])

    expect(ast.checkStartTag('if', tags[1], false)).toBe(false)
    expect(ast.checkStartTag('for', tags[2], false)).toBe(true)
  })

  it('checkStartTag /w debug', () => {
    const ast = new AST({ debug: true })
    const tags = [
      { name: 'for', startIndex: 0, endIndex: 1 },
      { name: 'end_if', startIndex: 2, endIndex: 3 },
    ]
    ast.start(tags[0])

    expect(() =>
      ast.checkStartTag('if', tags[1]),
    ).toThrowErrorMatchingInlineSnapshot(
      `[ASTError: "end_if" must follow "if", not "for".]`,
    )
  })

  it('checkAncestorStartTag', () => {
    const ast = new AST({})
    const tags = [
      { name: 'root', startIndex: 0, endIndex: 0 },
      { name: 'for', startIndex: 0, endIndex: 1 },
      { name: 'if', startIndex: 2, endIndex: 3 },
      { name: 'break', startIndex: 4, endIndex: 5 },
    ]

    ast.start(tags[0])
    ast.nextTag = 'end_raw'
    expect(ast.checkAncestorStartTag('for', tags[3])).toBe(true)

    ast.nextTag = null
    expect(ast.checkAncestorStartTag('for', tags[3])).toBe(false)

    ast.start(tags[1])
    expect(ast.checkAncestorStartTag('for', tags[3])).toBe(true)

    ast.start(tags[2])
    expect(ast.checkAncestorStartTag('for', tags[3])).toBe(true)
  })
})

it('real world', async () => {
  const ast = new AST(defaultOptions)
  await ast.parse(
    `{{= "hello, {name}" | t name="IJK" }}`,
    namedTags,
    unnamedTags,
  )
  expect(ast.children).toMatchInlineSnapshot(`[]`)
})
