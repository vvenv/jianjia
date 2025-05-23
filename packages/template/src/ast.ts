import type {
  ASTNode,
  BaseTag,
  EndTag,
  EngineOptions,
  Location,
  StartTag,
  Tag,
} from './types'
import { ASTError } from './ast-error'
import { END_ROOT, ROOT } from './config'
import { COMMENT } from './tags/comment'

/**
 * - Node
 *   - Tags[]
 *     - StartTag
 *       - children[]
 *         - Node
 *           - Tags[]
 *             - StartTag
 *             - StartTag
 *             - EndTag
 *         - Node
 *           - Tags[]
 *             - StartTag
 *             - StartTag
 *             - EndTag
 *     - StartTag
 *       - children[]
 *         - Node
 *           - Tags[]
 *             - StartTag
 *             - StartTag
 *             - EndTag
 *         - Node
 *           - Tags[]
 *             - StartTag
 *             - StartTag
 *             - EndTag
 *     - EndTag
 * - Node
 *   - Tags[]
 *     - StartTag
 *       - children[]
 *         - Node
 *           - Tags[]
 *             - StartTag
 *             - EndTag
 *     - EndTag
 */
export class AST implements ASTNode {
  template = ''
  /**
   * Current active node while parsing
   */
  current: ASTNode
  /**
   * Current tag cursor while consuming
   */
  cursor!: StartTag | EndTag
  /**
   * Next tag that is expected to be parsed.
   */
  nextTag: string | null = null

  tags: [StartTag, EndTag]
  parent: null
  previousSibling: null
  nextSibling: null
  level: number
  index: number

  constructor(public options: EngineOptions) {
    this.tags = [] as unknown as [StartTag, EndTag]
    this.parent = null
    this.previousSibling = null
    this.nextSibling = null
    this.level = 0
    this.index = 0

    this.current = this
  }

  get valid() {
    return this.tags.length % 2 === 0
  }

  get children() {
    return this.tags[0]?.children ?? []
  }

  async parse(
    template: string,
    namedTags: Record<string, Tag[]> = {},
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
      const base = this.baseTag(match)
      const tags = namedTags[base.identifier] ?? []
      for (const tag of tags) {
        if (
          (await tag.parse({
            ast: this,
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
  }

  private baseTag(match: RegExpExecArray): BaseTag {
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

  goto<T extends StartTag | EndTag = StartTag | EndTag>(tag: T): T {
    if (this.cursor) {
      this.cursor.next = tag
      tag.previous = this.cursor
    }
    return (this.cursor = tag) as T
  }

  /**
   * If the current node:
   * 1. has no tags, add it.
   * 2. has tags, add a new node with the tag to the children of the last tag.
   */
  start(tag: Partial<StartTag> & Location) {
    if (!this.verifyNextTag(tag)) {
      return
    }

    this.nextTag = null

    const { tags } = this.current

    const startTag = {
      ...tag,
      previousSibling: null,
      nextSibling: null,
      previous: null,
      next: null,
      children: [],
    } as StartTag

    // []
    if (tags.length === 0) {
      startTag.node = this.current
      tags.push(startTag)
      return this.goto(startTag)
    }

    // [...StartTag]
    const lastTag = this.current.tags.at(-1) as StartTag
    const { children } = lastTag
    const lastNode = children.at(-1) ?? null
    const node = {
      tags: [startTag],
      parent: this.current,
      previousSibling: lastNode,
      nextSibling: null,
      level: this.current.level + 1,
      index: children.length,
    } as ASTNode
    if (lastNode) {
      lastNode.nextSibling = node
    }
    startTag.node = node
    children.push(node)

    this.current = node

    return this.goto(startTag)
  }

  between(tag: Partial<StartTag> & Location) {
    if (!this.verifyNextTag(tag)) {
      return
    }

    this.nextTag = null

    const { tags } = this.current

    // For testing purposes
    if (!tags.length) {
      return
    }

    const lastTag = tags.at(-1) as StartTag
    const _tag = {
      ...tag,
      node: lastTag.node,
      previousSibling: lastTag,
      nextSibling: null,
      previous: null,
      next: null,
      children: [],
    } as StartTag

    lastTag.nextSibling = _tag
    tags.push(_tag)

    return this.goto(_tag)
  }

  end(tag: Partial<EndTag> & Location) {
    if (!this.verifyNextTag(tag)) {
      return
    }

    this.nextTag = null

    const { tags } = this.current

    // For testing purposes
    if (!tags.length) {
      return
    }

    const lastTag = tags.at(-1) as StartTag
    const _tag = {
      ...tag,
      previousSibling: lastTag,
      nextSibling: null,
      previous: null,
      next: null,
    } as EndTag

    lastTag.nextSibling = _tag
    tags.push(_tag)

    // It's a close block, so we need to move the cursor to the parent
    this.current = this.current.parent ?? this

    return this.goto(_tag)
  }

  private verifyNextTag(tag: Partial<StartTag | EndTag> & Location) {
    if (!this.nextTag || tag.name === this.nextTag) {
      return true
    }
    this.throwError(`expect "${this.nextTag}", "${tag.name}" found.`, [tag])
    return false
  }

  /**
   * Check if the start tag in current node is the given name.
   */
  checkStartTag(
    name: string,
    tag: Partial<StartTag | EndTag> & Location,
    required = true,
  ) {
    if (!this.verifyNextTag(tag)) {
      return true
    }
    const startTag = this.current.tags.at(0)!
    if (startTag.name === name) {
      return true
    }
    if (required) {
      this.throwError(`"${tag.name}" must follow "${name}", not "${startTag.name}".`, [startTag, tag])
    }
    return false
  }

  /**
   * Check if the start tag in current node or its ancestor is the given name.
   */
  checkAncestorStartTag(
    name: string,
    tag: Partial<StartTag | EndTag> & Location,
  ) {
    if (!this.verifyNextTag(tag)) {
      return true
    }
    let node = this.current
    while (node) {
      if (node.tags.at(0)!.name === name) {
        return true
      }
      node = node.parent!
    }
    this.throwError(`"${tag.name}" must be a descendant of "${name}".`, [tag])
    return false
  }

  throwError(message: string, tags: Location[]) {
    if (this.options.debug) {
      throw new ASTError(message, {
        template: this.template,
        tags,
      })
    }
  }
}
