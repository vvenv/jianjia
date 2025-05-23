import type { StartTag } from '../types'
import type { Tag } from '../types'

const WITH = 'with'
const END_WITH = 'end_with'

/**
 * @example {{ #with obj }}{{= key1 }}{{= key2 }}{{ /with }}
 */
export const tag: Tag = {
  names: [WITH],

  parse({ ast, base }) {
    if (base.isEnd) {
      const tag = {
        ...base,
        name: END_WITH,
      }

      if (ast.checkStartTag(WITH, tag)) {
        ast.end(tag)
        return
      }

      return false
    }

    if (base.data) {
      ast.start({
        ...base,
        name: WITH,
      })

      return
    }

    return false
  },

  async compile({ template, tag, context, out }, compileContent) {
    if (tag.name === WITH) {
      const { level, index } = (tag as StartTag).node
      const affix = `${level.toString(32)}_${index.toString(32)}`
      const _context = `${context}_${affix}`
      const loc = out.pushLine(
        `const ${_context}={`,
        `...${context},`,
        `...${context}.${tag.data}`,
        `};`,
      )
      await compileContent({
        template,
        tag: tag as StartTag,
        context: _context,
        out,
      })
      return loc
    }
  },
}
