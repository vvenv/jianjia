import type { StartTag } from '../types'
import type { Tag } from '../types'
import { parseStatement } from '../utils/parse-statement'

const IF = 'if'
const ELIF = 'elif'
const ELSE = 'else'
const END_IF = 'end_if'

/**
 * @example {{ #if my_var | my_filter }}yes{{ else }}no{{ /if }}
 *             ^^^ ^^^^^^^^^^^^^^^^^^         ^^^^        ^^^
 */
export const tag: Tag = {
  names: [IF, ELIF, ELSE],

  parse({ ast, base }) {
    if (base.isEnd) {
      const tag = {
        ...base,
        name: END_IF,
      }

      if (ast.checkStartTag(IF, tag)) {
        ast.end(tag)
      }

      return
    }

    if (base.identifier === ELSE) {
      const tag = {
        ...base,
        name: ELSE,
      }

      if (ast.checkStartTag(IF, tag, false)) {
        ast.between(tag)
        return
      }
    }

    if (base.identifier === ELIF) {
      if (base.data) {
        const tag = {
          ...base,
          name: ELIF,
        }

        if (ast.checkStartTag(IF, tag)) {
          ast.between(tag)
        }

        return
      }
    }

    if (base.identifier === IF) {
      if (base.data) {
        ast.start({
          ...base,
          name: IF,
        })

        return
      }
    }

    return false
  },

  async compile({ template, tag, context, out }, compileContent) {
    if (tag.name === IF) {
      const loc = out.pushLine(
        `if(${out.compileStatement(parseStatement((tag as StartTag).data!), context)}){`,
      )
      await compileContent({ template, tag: tag as StartTag, context, out })
      return loc
    }

    if (tag.name === ELIF) {
      const loc = out.pushLine(
        `}else if(${out.compileStatement(parseStatement((tag as StartTag).data!), context)}){`,
      )
      await compileContent({ template, tag: tag as StartTag, context, out })
      return loc
    }

    if (tag.name === ELSE) {
      if (
        tag.previousSibling?.name === IF
        || tag.previousSibling?.name === ELIF
      ) {
        const loc = out.pushLine('}else{')
        await compileContent({ template, tag: tag as StartTag, context, out })
        return loc
      }
    }

    if (tag.name === END_IF) {
      out.pushLine('}')
    }
  },
}
