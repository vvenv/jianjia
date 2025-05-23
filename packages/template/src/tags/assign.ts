import type { StartTag, Tag } from '../types'
import { parseStatement } from '../utils/parse-statement'

const ASSIGN = 'assign'
const END_ASSIGN = 'end_assign'
const RE
  = /^(?:([a-z$_][\w$]*)|([a-z$_][\w$]*(?:, [a-z$_][\w$]*)*) = ((['"`])(?:\\\4|(?!\4).)*\4|[^=]+))$/i

/**
 * @example {{ assign my_variable = my_value }}
 * @example {{ assign my_variable1, my_variable2 = my_value }}
 * @example {{ #assign my_variable }} this is {{= my_value }} {{ /assign }}
 */
export const tag: Tag = {
  names: [ASSIGN],

  parse({ ast, base }) {
    if (base.isEnd) {
      const tag = {
        ...base,
        name: END_ASSIGN,
      }

      if (ast.checkStartTag(ASSIGN, tag)) {
        ast.end(tag)
      }

      return
    }

    if (base.data) {
      const [, variable, left, right] = base.data.match(RE) ?? []

      if (base.isStart) {
        if (!variable) {
          ast.throwError(`invalid tag data`, [base])

          return false
        }

        ast.start({
          ...base,
          name: ASSIGN,
          data: {
            left: variable,
          },
        })

        return
      }

      if (!left || !right) {
        ast.throwError(`invalid tag data`, [base])

        return false
      }

      ast.start({
        ...base,
        name: ASSIGN,
        data: {
          left,
          right,
        },
      })

      // Self closing
      ast.end({
        ...base,
        startIndex: base.endIndex,
        name: END_ASSIGN,
      })

      return
    }

    return false
  },

  async compile({ template, tag, context, out }, compileContent) {
    if (tag.name === ASSIGN) {
      const { data: { left, right } } = tag as StartTag
      const names = (left as string).split(/, +/)
      if (right) {
        const lines: string[] = []
        lines.push(`Object.assign(${context},{`)
        const value = out.compileStatement(parseStatement(right), context)
        if (names.length > 1) {
          names.forEach((key, index) => {
            lines.push(`${index > 0 ? ',' : ''}${key}:${value}.${key}`)
          })
        }
        else {
          lines.push(`${left}:${value}`)
        }

        lines.push(`});`)
        return out.pushLine(...lines)
      }

      const loc = out.pushLine(
        `Object.assign(${context},{`,
        `${left}:await(async(s)=>{`,
      )
      await compileContent({
        template,
        tag: tag as StartTag,
        context,
        out,
      })
      out.pushLine(`return s;})("")});`)
      return loc
    }
  },
}
