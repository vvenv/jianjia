import type { StartTag, Tag } from '../types'
import { hasKeyword } from '../utils/has-keyword'
import { isEvil } from '../utils/is-evil'
import { parseStatement } from '../utils/parse-statement'

const EXPRESSION = 'expression'
const END_EXPRESSION = 'end_expression'

/**
 * @example {{ x | f }}
 * @example {{ 'a' if x else 'b' }}
 */
export const tag: Tag = {
  names: ['='],

  parse({ ast, base }) {
    if (verifyExpression(base.data!)) {
      ast.start({
        ...base,
        name: EXPRESSION,
      })

      // Self closing
      ast.end({
        ...base,
        startIndex: base.endIndex,
        name: END_EXPRESSION,
      })

      return
    }

    return false
  },

  compile({ tag, context, out }) {
    if (tag.name === EXPRESSION) {
      const [, a, cond, b]
        = (tag as StartTag).data!.match(/^(.+?) if (.+?)(?: else (.+))?$/)
          ?? []
      if (cond) {
        return out.pushVar(
          `${out.compileStatement(parseStatement(cond), context)} ? ${out.compileStatement(parseStatement(a), context)} : ${b ? out.compileStatement(parseStatement(b), context) : '""'}`,
        )
      }
      const [statement0] = parseStatement((tag as StartTag).data!)
      return out.pushVar(
        out.compileStatement(
          [
            {
              ...statement0,
              value: out.unescapeTag(statement0.value),
            },
          ],
          context,
        ),
      )
    }
  },
}

function verifyExpression(content: string) {
  return !isEvil(content) && !hasKeyword(content)
}
