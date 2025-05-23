import { EndTag } from '../ast';
import { Tag } from '../types';

const RAW = 'raw';
const END_RAW = 'end_raw';
const RE = /^(#|\/)raw$/m;

/**
 * @example {{ #raw }} <script>{{ #if x }}foo{{ /if }}</script> {{ /raw }}
 *                     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 */
export const tag: Tag = {
  parse({ ast, base, content }) {
    const [, char] = content.match(RE) ?? [];

    if (char === '/') {
      const tag = {
        ...base,
        name: END_RAW,
      };

      if (ast.verifyStartTag(RAW, tag)) {
        ast.end(tag);
      }

      return;
    }

    if (char === '#') {
      ast.start({
        ...base,
        name: RAW,
      });

      ast.nextTag = END_RAW;

      return;
    }

    return false;
  },

  async compile({ template, tag, ast, out }) {
    if (tag.name === RAW) {
      const loc = out.pushStr(
        template.slice(tag.endIndex, (tag.nextSibling as EndTag).startIndex),
      );
      ast.goto(tag.nextSibling as EndTag);
      return loc;
    }

    if (tag.name === END_RAW) {
      return;
    }

    return false;
  },
};
