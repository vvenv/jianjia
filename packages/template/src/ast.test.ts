import { describe, expect, test } from 'vitest';
import { AST } from './ast';
import { tags } from './tags';
import { defaultOptions } from './engine';

expect.addSnapshotSerializer({
  serialize: () => 'AST',
  test: (val) => val instanceof AST,
});

test('empty', () => {
  const tree = new AST({});

  expect(tree.valid).toBe(true);
  expect(tree.children).toMatchInlineSnapshot(`[]`);

  tree.start({
    name: 'root',
    startIndex: 0,
    endIndex: 0,
  });
  expect(tree.valid).toBe(false);
  expect(tree.children).toMatchInlineSnapshot(`[]`);

  tree.end({
    name: 'end_root',
    startIndex: 0,
    endIndex: 0,
  });
  expect(tree.valid).toBe(true);
  expect(tree.children).toMatchInlineSnapshot(`[]`);
});

test('add tags', () => {
  const ast = new AST({});

  let i = 0;

  expect(ast.valid).toBe(true);
  expect(ast.children).toMatchInlineSnapshot(`[]`);

  ast.start({
    name: 'root',
    startIndex: i++,
    endIndex: i++,
  });
  expect(ast.valid).toBe(false);

  ast.start({
    name: 'if',
    startIndex: i++,
    endIndex: i++,
    rawStatement: 'x',
  });
  expect(ast.valid).toBe(false);

  ast.end({
    name: 'end_if',
    startIndex: i++,
    endIndex: i++,
  });
  expect(ast.valid).toBe(false);

  ast.start({
    name: 'if',
    startIndex: i++,
    endIndex: i++,
    rawStatement: 'x',
  });
  expect(ast.valid).toBe(false);

  ast.between({
    name: 'elif',
    startIndex: i,
    endIndex: i,
    rawStatement: 'y',
  });
  expect(ast.valid).toBe(false);

  ast.between({
    name: 'else',
    startIndex: i++,
    endIndex: i++,
  });
  expect(ast.valid).toBe(false);

  ast.start({
    name: 'if',
    startIndex: i,
    endIndex: i,
    rawStatement: 'z',
  });
  expect(ast.valid).toBe(false);

  ast.start({
    name: 'if',
    startIndex: i++,
    endIndex: i++,
    rawStatement: 'x',
  });
  expect(ast.valid).toBe(false);

  ast.end({
    name: 'end_if',
    startIndex: i++,
    endIndex: i++,
  });
  expect(ast.valid).toBe(false);

  ast.end({
    name: 'end_if',
    startIndex: i++,
    endIndex: i++,
  });
  expect(ast.valid).toBe(false);

  ast.end({
    name: 'end_if',
    startIndex: i++,
    endIndex: i++,
  });
  expect(ast.valid).toBe(false);

  ast.end({
    name: 'end_root',
    startIndex: i++,
    endIndex: i++,
  });
  expect(ast.valid).toBe(true);
});

describe('validation', () => {
  test('Unexpected end_if tag', () => {
    const ast = new AST({});

    ast.end({
      name: 'end_if',
      startIndex: 0,
      endIndex: 1,
    });
    expect(ast.valid).toBe(true);
    expect(ast.children).toMatchInlineSnapshot(`[]`);
  });

  test('Unexpected else tag', () => {
    const ast = new AST({});

    ast.between({
      name: 'else',
      startIndex: 0,
      endIndex: 1,
    });
    expect(ast.valid).toBe(true);
    expect(ast.children).toMatchInlineSnapshot(`[]`);
  });

  test('Unexpected next tag', () => {
    const ast = new AST({});

    ast.start({
      name: 'raw',
      startIndex: 0,
      endIndex: 1,
    });
    ast.nextTag = 'end_raw';
    ast.end({
      name: 'for',
      startIndex: 2,
      endIndex: 3,
    });
    expect(ast.valid).toBe(false);
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
    `);
  });

  test('Unexpected next tag 2', () => {
    const ast = new AST({});

    ast.start({
      name: 'raw',
      startIndex: 0,
      endIndex: 1,
    });
    ast.nextTag = 'end_raw';
    ast.between({
      name: 'for',
      startIndex: 2,
      endIndex: 3,
    });
    expect(ast.valid).toBe(false);
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
    `);
  });
});

describe('validation w/ debug', () => {
  test('Unexpected end_if tag', () => {
    try {
      const ast = new AST({ debug: true });

      ast.end({
        name: 'end_if',
        startIndex: 0,
        endIndex: 1,
      });
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`[]`);
    }
  });

  test('Unexpected else tag', () => {
    try {
      const ast = new AST({ debug: true });

      ast.between({
        name: 'else',
        startIndex: 0,
        endIndex: 1,
      });
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`[]`);
    }
  });

  test('Unexpected next tag', () => {
    try {
      const ast = new AST({ debug: true });

      ast.start({
        name: 'raw',
        startIndex: 0,
        endIndex: 1,
      });
      ast.nextTag = 'end_raw';
      ast.end({
        name: 'for',
        startIndex: 2,
        endIndex: 3,
      });
    } catch (error) {
      expect(error).toMatchInlineSnapshot(
        `[ASTError: expect "end_raw", "for" found.]`,
      );
    }
  });

  test('Unexpected next tag 2', () => {
    try {
      const ast = new AST({ debug: true });

      ast.start({
        name: 'raw',
        startIndex: 0,
        endIndex: 1,
      });
      ast.nextTag = 'end_raw';
      ast.between({
        name: 'for',
        startIndex: 2,
        endIndex: 3,
      });
    } catch (error) {
      expect(error).toMatchInlineSnapshot(
        `[ASTError: expect "end_raw", "for" found.]`,
      );
    }
  });
});

describe('verify', () => {
  test('verifyStartTag', () => {
    const ast = new AST({});
    const tags = [
      { name: 'for', startIndex: 0, endIndex: 1 },
      { name: 'end_if', startIndex: 2, endIndex: 3 },
      { name: 'end_for', startIndex: 4, endIndex: 5 },
    ];
    ast.start(tags[0]);

    expect(ast.verifyStartTag('if', tags[1], false)).toBe(false);
    expect(ast.verifyStartTag('for', tags[2], false)).toBe(true);
  });

  test('verifyStartTag /w debug', () => {
    const ast = new AST({ debug: true });
    const tags = [
      { name: 'for', startIndex: 0, endIndex: 1 },
      { name: 'end_if', startIndex: 2, endIndex: 3 },
    ];
    ast.start(tags[0]);

    expect(() =>
      ast.verifyStartTag('if', tags[1]),
    ).toThrowErrorMatchingInlineSnapshot(
      `[ASTError: "end_if" must follow "if", not "for".]`,
    );
  });

  test('verifyAncestorStartTag', () => {
    const ast = new AST({});
    const tags = [
      { name: 'root', startIndex: 0, endIndex: 0 },
      { name: 'for', startIndex: 0, endIndex: 1 },
      { name: 'if', startIndex: 2, endIndex: 3 },
      { name: 'break', startIndex: 4, endIndex: 5 },
    ];

    ast.start(tags[0]);
    ast.nextTag = 'end_raw';
    expect(ast.verifyAncestorStartTag('for', tags[3])).toBe(true);

    ast.nextTag = null;
    expect(ast.verifyAncestorStartTag('for', tags[3])).toBe(false);

    ast.start(tags[1]);
    expect(ast.verifyAncestorStartTag('for', tags[3])).toBe(true);

    ast.start(tags[2]);
    expect(ast.verifyAncestorStartTag('for', tags[3])).toBe(true);
  });
});

test('real world', async () => {
  const ast = new AST(defaultOptions);
  await ast.parse(`{{ "hello, {name}" | t name="IJK" }}`, tags);
  expect(ast.children).toMatchInlineSnapshot(`
    [
      {
        "index": 0,
        "level": 1,
        "nextSibling": null,
        "parent": AST,
        "previousSibling": null,
        "tags": [
          {
            "children": [],
            "endIndex": 36,
            "name": "expression",
            "next": {
              "endIndex": 36,
              "name": "end_expression",
              "next": {
                "endIndex": 36,
                "name": "end_root",
                "next": null,
                "nextSibling": null,
                "previous": [Circular],
                "previousSibling": {
                  "children": [Circular],
                  "endIndex": 0,
                  "name": "root",
                  "next": [Circular],
                  "nextSibling": [Circular],
                  "node": AST,
                  "previous": null,
                  "previousSibling": null,
                  "startIndex": 0,
                },
                "startIndex": 36,
              },
              "nextSibling": null,
              "previous": [Circular],
              "previousSibling": [Circular],
              "startIndex": 36,
              "stripAfter": false,
              "stripBefore": false,
            },
            "nextSibling": {
              "endIndex": 36,
              "name": "end_expression",
              "next": {
                "endIndex": 36,
                "name": "end_root",
                "next": null,
                "nextSibling": null,
                "previous": [Circular],
                "previousSibling": {
                  "children": [Circular],
                  "endIndex": 0,
                  "name": "root",
                  "next": [Circular],
                  "nextSibling": [Circular],
                  "node": AST,
                  "previous": null,
                  "previousSibling": null,
                  "startIndex": 0,
                },
                "startIndex": 36,
              },
              "nextSibling": null,
              "previous": [Circular],
              "previousSibling": [Circular],
              "startIndex": 36,
              "stripAfter": false,
              "stripBefore": false,
            },
            "node": [Circular],
            "previous": {
              "children": [Circular],
              "endIndex": 0,
              "name": "root",
              "next": [Circular],
              "nextSibling": {
                "endIndex": 36,
                "name": "end_root",
                "next": null,
                "nextSibling": null,
                "previous": {
                  "endIndex": 36,
                  "name": "end_expression",
                  "next": [Circular],
                  "nextSibling": null,
                  "previous": [Circular],
                  "previousSibling": [Circular],
                  "startIndex": 36,
                  "stripAfter": false,
                  "stripBefore": false,
                },
                "previousSibling": [Circular],
                "startIndex": 36,
              },
              "node": AST,
              "previous": null,
              "previousSibling": null,
              "startIndex": 0,
            },
            "previousSibling": null,
            "rawStatement": ""hello, {name}" | t name="IJK"",
            "startIndex": 0,
            "statement": [
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
            ],
            "stripAfter": false,
            "stripBefore": false,
          },
          {
            "endIndex": 36,
            "name": "end_expression",
            "next": {
              "endIndex": 36,
              "name": "end_root",
              "next": null,
              "nextSibling": null,
              "previous": [Circular],
              "previousSibling": {
                "children": [Circular],
                "endIndex": 0,
                "name": "root",
                "next": {
                  "children": [],
                  "endIndex": 36,
                  "name": "expression",
                  "next": [Circular],
                  "nextSibling": [Circular],
                  "node": [Circular],
                  "previous": [Circular],
                  "previousSibling": null,
                  "rawStatement": ""hello, {name}" | t name="IJK"",
                  "startIndex": 0,
                  "statement": [
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
                  ],
                  "stripAfter": false,
                  "stripBefore": false,
                },
                "nextSibling": [Circular],
                "node": AST,
                "previous": null,
                "previousSibling": null,
                "startIndex": 0,
              },
              "startIndex": 36,
            },
            "nextSibling": null,
            "previous": {
              "children": [],
              "endIndex": 36,
              "name": "expression",
              "next": [Circular],
              "nextSibling": [Circular],
              "node": [Circular],
              "previous": {
                "children": [Circular],
                "endIndex": 0,
                "name": "root",
                "next": [Circular],
                "nextSibling": {
                  "endIndex": 36,
                  "name": "end_root",
                  "next": null,
                  "nextSibling": null,
                  "previous": [Circular],
                  "previousSibling": [Circular],
                  "startIndex": 36,
                },
                "node": AST,
                "previous": null,
                "previousSibling": null,
                "startIndex": 0,
              },
              "previousSibling": null,
              "rawStatement": ""hello, {name}" | t name="IJK"",
              "startIndex": 0,
              "statement": [
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
              ],
              "stripAfter": false,
              "stripBefore": false,
            },
            "previousSibling": {
              "children": [],
              "endIndex": 36,
              "name": "expression",
              "next": [Circular],
              "nextSibling": [Circular],
              "node": [Circular],
              "previous": {
                "children": [Circular],
                "endIndex": 0,
                "name": "root",
                "next": [Circular],
                "nextSibling": {
                  "endIndex": 36,
                  "name": "end_root",
                  "next": null,
                  "nextSibling": null,
                  "previous": [Circular],
                  "previousSibling": [Circular],
                  "startIndex": 36,
                },
                "node": AST,
                "previous": null,
                "previousSibling": null,
                "startIndex": 0,
              },
              "previousSibling": null,
              "rawStatement": ""hello, {name}" | t name="IJK"",
              "startIndex": 0,
              "statement": [
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
              ],
              "stripAfter": false,
              "stripBefore": false,
            },
            "startIndex": 36,
            "stripAfter": false,
            "stripBefore": false,
          },
        ],
      },
    ]
  `);
});
