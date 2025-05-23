import { EndTag, StartTag } from '../ast';
import { Tag } from '../types';

const COMMENT = 'comment';
const END_COMMENT = 'end_comment';
const RE = /^(?:!\s(.+)|#\s(.+?)\s#|(#comment)|(\/comment))$/ms;

/**
 * @example {{ ! This is a comment }}
 *              ^^^^^^^^^^^^^^^^^
 * @example {{ # This is a comment # }}
 *              ^^^^^^^^^^^^^^^^^
 * @example {{ #comment }} This is a comment {{ /comment }}
 *                       ^^^^^^^^^^^^^^^^^
 */
export const tag: Tag = {
  parse({ ast, base, content }) {
    const [, __, data = __, start, end] = content.match(RE) ?? [];

    if (end) {
      const tag = {
        ...base,
        name: END_COMMENT,
      };

      if (ast.verifyStartTag(COMMENT, tag)) {
        ast.end(tag);
      }

      return;
    }

    if (start) {
      ast.start({
        ...base,
        name: COMMENT,
      });

      return;
    }

    if (data) {
      ast.start({
        ...base,
        name: COMMENT,
        data,
      });

      // Self closing
      ast.end({
        ...base,
        startIndex: base.endIndex,
        name: END_COMMENT,
      });

      return;
    }

    return false;
  },

  async compile({ template, tag, context, ast, out }, compileContent) {
    if (tag.name === COMMENT) {
      if (out.options.stripComments) {
        ast.goto(tag.nextSibling as EndTag);
      } else {
        const { data } = tag as StartTag;
        if (data) {
          out.pushStr(`<!--${data}-->`);
        } else {
          out.pushStr('<!--');
          await compileContent({
            template,
            tag: tag as StartTag,
            context,
            out,
          });
        }
      }

      return;
    }

    if (tag.name === END_COMMENT) {
      if (!out.options.stripComments) {
        if (!tag.previousSibling?.data) {
          out.pushStr('-->');
        }
      }

      return;
    }

    return false;
  },
};
