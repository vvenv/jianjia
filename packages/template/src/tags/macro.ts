import type { StartTag, Tag } from '../types'
import { parseFormalArgs } from '../utils/parse-formal-args'

const MACRO = 'macro'
const END_MACRO = 'end_macro'
const CALLER = 'caller'
const END_CALLER = 'end_caller'
const RE = /^([a-z$_][\w$]*)(?:: (.+))?$/

/**
 * @example {{ #macro my_macro: x, y }}...{{ caller }}{{ /macro }}{{ my_macro: "foo", 1 }}
 *                    ^^^^^^^^  ^^^^                                 ^^^^^^^^  ^^^^^^^^
 */
export const tag: Tag = {
  names: [MACRO, CALLER],

  parse({ ast, base }) {
    if (base.identifier === MACRO) {
      if (base.isEnd) {
        const tag = {
          ...base,
          name: END_MACRO,
        }

        if (ast.checkStartTag(MACRO, tag)) {
          ast.end(tag)
        }

        return
      }

      if (base.data) {
        const [, name, args] = base.data.match(RE) ?? []

        if (name) {
          ast.start({
            ...base,
            name: MACRO,
            data: {
              name,
              args: args ? parseFormalArgs(args) : [],
            },
          })
        }

        return
      }
    }

    if (base.identifier === CALLER) {
      const tag = {
        ...base,
        name: CALLER,
      }

      if (ast.checkStartTag(MACRO, tag)) {
        ast.start(tag)

        // Self closing
        ast.end({
          ...base,
          startIndex: base.endIndex,
          name: END_CALLER,
        })
      }

      return
    }

    return false
  },

  async compile({ template, tag, context, out }, compileContent) {
    if (tag.name === MACRO) {
      const { level, index } = (tag as StartTag).node
      const affix = `${level.toString(32)}_${index.toString(32)}`
      const { data: { name, args } } = tag as StartTag
      const lines: string[] = []
      lines.push(`${context}.${name}=async(${['_c', ...args].join(',')})=>{`)
      let _context = context
      if (args.length) {
        _context = `${context}_${affix}`
        lines.push(`const ${_context}={`, `...${context},`)
        args.forEach((param: string) => {
          lines.push(`${param.replace(/(\w+)=.+/, '$1')},`)
        })
        lines.push(`};`)
      }
      const loc = out.pushLine(...lines)
      await compileContent({
        template,
        tag: tag as StartTag,
        context: _context,
        out,
      })
      return loc
    }

    if (tag.name === CALLER) {
      const loc = out.pushLine(`await _c?.();`)
      await compileContent({ template, tag: tag as StartTag, context, out })
      return loc
    }

    if (tag.name === END_MACRO) {
      out.pushLine('};')
    }
  },
}
