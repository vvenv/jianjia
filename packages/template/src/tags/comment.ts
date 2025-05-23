import type { EndTag, StartTag, Tag } from '../types'

export const COMMENT = 'comment'
const END_COMMENT = 'end_comment'

/**
 * @example {{! This is a comment }}
 * @example {{ #comment }} This is a comment {{ /comment }}
 */
export const tag: Tag = {
  names: [COMMENT],

  parse({ ast, base }) {
    if (base.isEnd) {
      const tag = {
        ...base,
        name: END_COMMENT,
      }

      if (ast.checkStartTag(COMMENT, tag)) {
        ast.end(tag)
      }

      return
    }

    // Inline comment
    if (base.data) {
      ast.start({
        ...base,
        name: COMMENT,
      })

      // Self closing
      ast.end({
        ...base,
        startIndex: base.endIndex,
        name: END_COMMENT,
      })

      return
    }

    ast.start({
      ...base,
      name: COMMENT,
    })
  },

  async compile({ template, tag, context, ast, out }, compileContent) {
    if (tag.name === COMMENT) {
      if (out.options.stripComments) {
        ast.goto(tag.nextSibling as EndTag)
      }
      else {
        const { data } = tag as StartTag
        if (data) {
          out.pushStr(`<!--${data}-->`)
        }
        else {
          out.pushStr('<!--')
          await compileContent({
            template,
            tag: tag as StartTag,
            context,
            out,
          })
        }
      }

      return
    }

    if (tag.name === END_COMMENT) {
      if (!out.options.stripComments) {
        if (!tag.previousSibling?.data) {
          out.pushStr('-->')
        }
      }
    }
  },
}
