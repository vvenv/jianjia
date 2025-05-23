import type { AST } from './ast'
import type { OutScript } from './out-script'
import type { Parser } from './parser'

export type MaybePromise<T> = T | Promise<T>

export type ObjectType = Record<string, any>

export interface Location {
  startIndex: number
  endIndex: number
}

export interface Mapping {
  source: Location
  target: Location
}

export interface FilterMeta {
  name: string
  args: string
}

export interface Statement {
  type: 'expression' | 'operator'
  value: string
  filters?: FilterMeta[]
}

export interface Globals {
  translations?: Record<string, string>
  [key: string]: any
}

export interface Helpers {
  getIn: (obj: any[] | ObjectType, index: number, key: string) => any
}

export type Filters = Record<string, Filter>

export interface Filter {
  (value: any, ...args: any[]): any
}

export type ParsedFunction = (
  globals: Globals,
  filters: Filters,
  escape: (v: unknown) => unknown,
  helpers: Helpers
) => Promise<string>

export interface BaseTag extends Location {
  identifier: string
  data?: string
  isStart?: boolean
  isEnd?: boolean
  /**
   * The original tag statement, with tags and whitespaces.
   */
  original: string
  stripBefore: boolean
  stripAfter: boolean
  previous: StartTag | EndTag | null
  next: StartTag | EndTag | null
}

export interface StartTag extends BaseTag {
  name: string
  data?: any
  node: ASTNode
  previousSibling: StartTag | null
  nextSibling: StartTag | EndTag | null
  children: ASTNode[]
}

export interface EndTag extends BaseTag {
  name: string
  previousSibling: StartTag
  nextSibling: null
}

export interface ASTNode {
  tags: [...StartTag[], EndTag]
  parent: ASTNode | null
  previousSibling: ASTNode | null
  nextSibling: ASTNode | null
  level: number
  index: number
}

export interface Tag {
  names: string[]

  /**
   * - void: handled by the parser
   * - false: not handled by the parser
   */
  parse: (arg: { ast: AST, base: BaseTag }) => MaybePromise<void | false>

  compile: (
    arg: {
      parser: Parser
      template: string
      tag: StartTag | EndTag
      context: string
      ast: AST
      out: OutScript
    },
    compileContent: (arg: {
      template: string
      tag: StartTag
      context: string
      out: OutScript
    }) => Promise<void>,
  ) => MaybePromise<void | false | Location>
}

export interface EngineOptions {
  debug?: boolean
  globals?: Globals
  filters?: Filters
  tags?: Tag[]
  strictMode?: boolean
  autoEscape?: boolean
  stripComments?: boolean
  loader?: (path: string) => Promise<string>
}
