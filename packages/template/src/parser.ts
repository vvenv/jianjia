import type {
  AST,
  ASTNode,
  ASTNodeBase,
  EngineOptions,
  Location,
} from './types'
import { END_ROOT, ROOT } from './config'
import { ParserError } from './parser-error'
import { COMMENT } from './tags/comment'

/**
 * - AST
 *   - ASTNode
 *     - children
 *       - AST
 *         - ASTNode
 *       - AST
 *         - ASTNode
 *   - ASTNode
 *     - children
 *       - AST
 *         - ASTNode
 *       - AST
 *         - ASTNode
 *   - ASTNode
 * - AST
 *   - ASTNode
 *     - children
 *       - AST
 *         - ASTNode
 *   - ASTNode
 */
export class Parser implements AST {
  template = ''
  /**
   * Current active node while parsing
   */
  current: AST
  /**
   * Current node cursor while consuming
   */
  cursor!: ASTNode
  /**
   * Next node that is expected to be parsed.
   */
  nextNode: string | null = null

  nodes: ASTNode[]
  parent: null
  previousSibling: null
  nextSibling: null
  level: number
  index: number

  constructor(public options: Required<EngineOptions>) {
    this.nodes = []
    this.parent = null
    this.previousSibling = null
    this.nextSibling = null
    this.level = 0
    this.index = 0

    this.current = this
  }

  get valid() {
    return this.nodes.length % 2 === 0
  }

  get children() {
    return this.nodes[0]?.children ?? []
  }

  async parse(
    template: string,
  ) {
    this.template = template

    const root = this.start({
      name: ROOT,
      startIndex: 0,
      endIndex: 0,
    })!

    this.cursor = root

    const tagRe = /\{\{(-)?(=|!)? (.+?) (-)?\}\}/gs
    let match
    // eslint-disable-next-line no-cond-assign
    while ((match = tagRe.exec(template))) {
      const base = this.baseNode(match)
      const tags = this.options.tags[base.identifier] ?? []
      for (const tag of tags) {
        if (
          (await tag.parse({
            parser: this,
            base,
          })) !== false
        ) {
          break
        }
      }
    }

    this.end({
      name: END_ROOT,
      startIndex: template.length,
      endIndex: template.length,
    })

    // Reset cursor after parsed
    this.cursor = root

    return this
  }

  private baseNode(match: RegExpExecArray): ASTNodeBase {
    const base = {
      original: match[0],
      stripBefore: match[1] === '-',
      stripAfter: match[4] === '-',
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      previous: null,
      next: null,
    }

    if (match[2] === '=') {
      return {
        ...base,
        identifier: '=',
        data: match[3],
      }
    }

    if (match[2] === '!') {
      return {
        ...base,
        identifier: COMMENT,
        data: match[3],
      }
    }

    const [, prefix, identifier, data]
      = match[3].match(/^([#/])?([a-z]+)(?: (.+))?$/) ?? []

    return {
      ...base,
      identifier,
      data,
      isStart: prefix === '#',
      isEnd: prefix === '/',
    }
  }

  goto(node: ASTNode) {
    if (this.cursor) {
      this.cursor.next = node
      node.previous = this.cursor
    }
    return this.cursor = node
  }

  /**
   * If the current ast:
   * 1. no nodes, add it.
   * 2. has nodes, add a new ast with the node to the children of the last node.
   */
  start(baseNode: Partial<ASTNode> & Location) {
    if (!this.verifyNextNode(baseNode)) {
      return
    }

    this.nextNode = null

    const { nodes } = this.current

    const node = {
      ...baseNode,
      previousSibling: null,
      nextSibling: null,
      previous: null,
      next: null,
      children: [],
    } as ASTNode

    if (nodes.length === 0) {
      node.ast = this.current
      nodes.push(node)
      return this.goto(node)
    }

    const { children } = this.current.nodes.at(-1)!
    const lastAST = children.at(-1)
    const ast = {
      nodes: [node],
      parent: this.current,
      previousSibling: lastAST ?? null,
      nextSibling: null,
      level: this.current.level + 1,
      index: children.length,
    } as AST
    if (lastAST) {
      lastAST.nextSibling = ast
    }
    node.ast = ast
    children.push(ast)

    this.current = ast

    return this.goto(node)
  }

  between(baseNode: Partial<ASTNode> & Location) {
    if (!this.verifyNextNode(baseNode)) {
      return
    }

    this.nextNode = null

    const { nodes } = this.current

    // For testing purposes
    if (!nodes.length) {
      return
    }

    const lastNode = nodes.at(-1)!
    const node = {
      ...baseNode,
      ast: lastNode.ast,
      previousSibling: lastNode,
      nextSibling: null,
      previous: null,
      next: null,
      children: [],
    } as ASTNode

    lastNode.nextSibling = node
    nodes.push(node)

    return this.goto(node)
  }

  end(baseNode: Partial<ASTNode> & Location) {
    if (!this.verifyNextNode(baseNode)) {
      return
    }

    this.nextNode = null

    const { nodes } = this.current

    // For testing purposes
    if (!nodes.length) {
      return
    }

    const lastNode = nodes.at(-1)!
    const node = {
      ...baseNode,
      previousSibling: lastNode,
      nextSibling: null,
      previous: null,
      next: null,
    } as ASTNode

    lastNode.nextSibling = node
    nodes.push(node)

    // It's a close block, so we need to move the cursor to the parent
    this.current = this.current.parent ?? this

    return this.goto(node)
  }

  private verifyNextNode(node: Partial<ASTNode> & Location) {
    if (!this.nextNode || node.name === this.nextNode) {
      return true
    }
    this.throwError(`expect "${this.nextNode}", "${node.name}" found.`, [node])
    return false
  }

  /**
   * Check if the start node in current ast matches the given name.
   */
  checkStartNode(
    name: string,
    node: Partial<ASTNode> & Location,
    required = true,
  ) {
    if (!this.verifyNextNode(node)) {
      return true
    }
    const startNode = this.current.nodes.at(0)!
    if (startNode.name === name) {
      return true
    }
    if (required) {
      this.throwError(`"${node.name}" must follow "${name}", not "${startNode.name}".`, [startNode, node])
    }
    return false
  }

  /**
   * Check if the start nide in current ast or its ancestor matches the given name.
   */
  checkAncestorStartNode(
    name: string,
    node: Partial<ASTNode> & Location,
  ) {
    if (!this.verifyNextNode(node)) {
      return true
    }
    let ast = this.current
    while (ast) {
      if (ast.nodes.at(0)!.name === name) {
        return true
      }
      ast = ast.parent!
    }
    this.throwError(`"${node.name}" must be a descendant of "${name}".`, [node])
    return false
  }

  throwError(message: string, nodes: Location[]) {
    if (this.options.debug) {
      throw new ParserError(message, {
        template: this.template,
        nodes,
      })
    }
  }
}
