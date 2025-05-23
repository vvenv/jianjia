import type { Tag } from '../types'
import { FOR } from './for'

const CONTINUE = 'continue'
const END_CONTINUE = 'end_continue'

/**
 * @example {{ continue }}
 */
export const tag: Tag = {
  names: [CONTINUE],

  parse({ ast, base }) {
    const tag = {
      ...base,
      name: CONTINUE,
    }

    if (ast.checkAncestorStartTag(FOR, tag)) {
      ast.start(tag)

      // Self closing
      ast.end({
        ...base,
        startIndex: base.endIndex,
        name: END_CONTINUE,
      })

      return
    }

    return false
  },

  compile({ tag, out }) {
    if (tag.name === CONTINUE) {
      return out.pushLine('continue;')
    }
  },
}
