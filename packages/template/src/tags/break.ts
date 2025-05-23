import type { Tag } from '../types'
import { FOR } from './for'

const BREAK = 'break'
const END_BREAK = 'end_break'

/**
 * @example {{ break }}
 */
export const tag: Tag = {
  names: [BREAK],

  parse({ ast, base }) {
    const tag = {
      ...base,
      name: BREAK,
    }

    if (ast.checkAncestorStartTag(FOR, tag)) {
      ast.start(tag)

      // Self closing
      ast.end({
        ...base,
        startIndex: base.endIndex,
        name: END_BREAK,
      })

      return
    }

    return false
  },

  compile({ tag, out }) {
    if (tag.name === BREAK) {
      return out.pushLine('break;')
    }
  },
}
