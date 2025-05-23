import { ASTError } from './ast-error';
import { END_ROOT, ROOT } from './config';
import { Location } from './source-map';
import { Tag, EngineOptions } from './types';
import { parseStatement, Statement } from './utils/parse-statement';

export interface BaseTag extends Location {
  stripBefore: boolean;
  stripAfter: boolean;
  previous: StartTag | EndTag | null;
  next: StartTag | EndTag | null;
}

export interface EndTag extends BaseTag {
  name: string;
  previousSibling: StartTag;
  nextSibling: null;
}

export interface StartTag extends BaseTag {
  name: string;
  data?: any;
  /**
   * For those statements that are intent to be auto-parsed by AST.
   */
  rawStatement?: string;
  statement?: Statement[];
  node: ASTNode;
  previousSibling: StartTag | null;
  nextSibling: StartTag | EndTag | null;
  children: ASTNode[];
}

export interface ASTNode {
  tags: [...StartTag[], EndTag];
  parent: ASTNode | null;
  previousSibling: ASTNode | null;
  nextSibling: ASTNode | null;
  level: number;
  index: number;
}

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
  template = '';
  /**
   * Current active node while parsing
   */
  current: ASTNode;
  /**
   * Current tag cursor while consuming
   */
  cursor!: StartTag | EndTag;
  /**
   * Next tag that is expected to be parsed.
   */
  nextTag: string | null = null;

  tags: [StartTag, EndTag];
  parent: null;
  previousSibling: null;
  nextSibling: null;
  level: number;
  index: number;

  constructor(public options: EngineOptions) {
    this.tags = [] as unknown as [StartTag, EndTag];
    this.parent = null;
    this.previousSibling = null;
    this.nextSibling = null;
    this.level = 0;
    this.index = 0;

    this.current = this;
  }

  get valid() {
    return this.tags.length % 2 === 0;
  }

  get children() {
    return this.tags[0]?.children ?? [];
  }

  async parse(template: string, tags: Tag[]) {
    this.template = template;
    const { start, end } = this.options;

    const root = this.start({
      name: ROOT,
      startIndex: 0,
      endIndex: 0,
    })!;

    this.cursor = root;

    const tagRe = new RegExp(`${start}(-)?\\s(.+?)\\s(-)?${end}`, 'gms');
    let match;
    while ((match = tagRe.exec(template))) {
      const base = this.baseTag(match);
      for (const tag of tags) {
        if (
          (await tag.parse({
            ast: this,
            base,
            content: match[2],
            original: match[0],
          })) !== false
        ) {
          break;
        }
      }
    }

    this.end({
      name: END_ROOT,
      startIndex: template.length,
      endIndex: template.length,
    });

    // Reset cursor after parsed
    this.cursor = root;
  }

  private parseStatement(tag: Partial<StartTag> & Location) {
    if (tag.rawStatement) {
      tag.statement = parseStatement(tag.rawStatement);
    }
    return tag;
  }

  private baseTag(match: RegExpExecArray): BaseTag {
    return {
      stripBefore: match[1] === '-',
      stripAfter: match[3] === '-',
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      previous: null,
      next: null,
    };
  }

  goto<T extends StartTag | EndTag = StartTag | EndTag>(tag: T): T {
    if (this.cursor) {
      this.cursor.next = tag;
      tag.previous = this.cursor;
    }
    return (this.cursor = tag) as T;
  }

  /**
   * If the current node:
   * 1. has no tags, add it.
   * 2. has tags, add a new node with the tag to the children of the last tag.
   */
  start(tag: Partial<StartTag> & Location) {
    if (!this.verifyNextTag(tag)) {
      return;
    }

    this.nextTag = null;

    const { tags } = this.current;

    const startTag = {
      ...this.parseStatement(tag),
      previousSibling: null,
      nextSibling: null,
      previous: null,
      next: null,
      children: [],
    } as StartTag;

    // []
    if (tags.length === 0) {
      startTag.node = this.current;
      tags.push(startTag);
      return this.goto(startTag);
    }

    // [...StartTag]
    const lastTag = this.current.tags.at(-1) as StartTag;
    const { children } = lastTag;
    const lastNode = children.at(-1) ?? null;
    const node = {
      tags: [startTag],
      parent: this.current,
      previousSibling: lastNode,
      nextSibling: null,
      level: this.current.level + 1,
      index: children.length,
    } as ASTNode;
    if (lastNode) {
      lastNode.nextSibling = node;
    }
    startTag.node = node;
    children.push(node);

    this.current = node;

    return this.goto(startTag);
  }

  between(tag: Partial<StartTag> & Location) {
    if (!this.verifyNextTag(tag)) {
      return;
    }

    this.nextTag = null;

    const { tags } = this.current;

    // For testing purposes
    if (!tags.length) {
      return;
    }

    const lastTag = tags.at(-1) as StartTag;
    const _tag = {
      ...this.parseStatement(tag),
      node: lastTag.node,
      previousSibling: lastTag,
      nextSibling: null,
      previous: null,
      next: null,
      children: [],
    } as StartTag;

    lastTag.nextSibling = _tag;
    tags.push(_tag);

    return this.goto(_tag);
  }

  end(tag: Partial<EndTag> & Location) {
    if (!this.verifyNextTag(tag)) {
      return;
    }

    this.nextTag = null;

    const { tags } = this.current;

    // For testing purposes
    if (!tags.length) {
      return;
    }

    const lastTag = tags.at(-1) as StartTag;
    const _tag = {
      ...tag,
      previousSibling: lastTag,
      nextSibling: null,
      previous: null,
      next: null,
    } as EndTag;

    lastTag.nextSibling = _tag;
    tags.push(_tag);

    // It's a close block, so we need to move the cursor to the parent
    this.current = this.current.parent ?? this;

    return this.goto(_tag);
  }

  verifyNoPrevTag() {
    const startTag = (this.current.tags.at(0) as StartTag)?.children
      .at(0)
      ?.tags.at(0);
    if (!startTag) {
      return true;
    }
    if (this.options.debug) {
      throw new ASTError(`expect no previous tags, "${startTag.name}" found.`, {
        template: this.template,
        tags: [startTag],
      });
    }
    return false;
  }

  private verifyNextTag(tag: Partial<StartTag | EndTag> & Location) {
    if (!this.nextTag || tag.name === this.nextTag) {
      return true;
    }
    if (this.options.debug) {
      throw new ASTError(`expect "${this.nextTag}", "${tag.name}" found.`, {
        template: this.template,
        tags: [tag],
      });
    }
    return false;
  }

  /**
   * Check if the start tag in current node is the given name.
   */
  verifyStartTag(
    name: string,
    tag: Partial<StartTag | EndTag> & Location,
    required = true,
  ) {
    if (!this.verifyNextTag(tag)) {
      return true;
    }
    const startTag = this.current.tags.at(0)!;
    if (startTag.name === name) {
      return true;
    }
    if (required && this.options.debug) {
      throw new ASTError(
        `"${tag.name}" must follow "${name}", not "${startTag.name}".`,
        {
          template: this.template,
          tags: [startTag, tag],
        },
      );
    }
    return false;
  }

  /**
   * Check if the start tag in current node or its ancestor is the given name.
   */
  verifyAncestorStartTag(
    name: string,
    tag: Partial<StartTag | EndTag> & Location,
  ) {
    if (!this.verifyNextTag(tag)) {
      return true;
    }
    let node = this.current;
    while (node) {
      if (node.tags.at(0)!.name === name) {
        return true;
      }
      node = node.parent!;
    }
    if (this.options.debug) {
      throw new ASTError(`"${tag.name}" must be a descendant of "${name}".`, {
        template: this.template,
        tags: [tag],
      });
    }
    return false;
  }
}
