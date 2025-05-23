import type { EndTag, Tag } from '../types'

const RAW = 'raw'
const END_RAW = 'end_raw'

/**
 * @example {{ #raw }} <script>{{ #if x }}foo{{ /if }}</script> {{ /raw }}
 *                     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 */
export const tag: Tag = {
  names: [RAW],

  parse({ ast, base }) {
    if (base.isEnd) {
      const tag = {
        ...base,
        name: END_RAW,
      }

      if (ast.checkStartTag(RAW, tag)) {
        ast.end(tag)
      }

      return
    }

    ast.start({
      ...base,
      name: RAW,
    })

    ast.nextTag = END_RAW
  },

  async compile({ template, tag, ast, out }) {
    if (tag.name === RAW) {
      const loc = out.pushStr(
        template.slice(tag.endIndex, (tag.nextSibling as EndTag).startIndex),
      )
      ast.goto(tag.nextSibling as EndTag)
      return loc
    }
  },
}
