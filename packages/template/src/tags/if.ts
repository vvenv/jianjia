import { StartTag } from '../ast';
import { Tag } from '../types';

const IF = 'if';
const ELIF = 'elif';
const ELSE = 'else';
const END_IF = 'end_if';
const RE = /^(?:(el|#)if\s+(.+))|(else)|(\/if)$/;

/**
 * @example {{ #if my_var | my_filter }}yes{{ else }}no{{ /if }}
 *             ^^ ^^^^^^^^^^^^^^^^^^       ^^^^      ^^^
 */
export const tag: Tag = {
  parse({ ast, base, content }) {
    const [, start, rawStatement, _else, end] = content.match(RE) ?? [];

    if (end) {
      const tag = {
        ...base,
        name: END_IF,
      };

      if (ast.verifyStartTag(IF, tag)) {
        ast.end(tag);
      }

      return;
    }

    if (_else) {
      const tag = {
        ...base,
        name: ELSE,
      };

      if (ast.verifyStartTag(IF, tag, false)) {
        ast.between(tag);
        return;
      }
    }

    if (start === 'el') {
      const tag = {
        ...base,
        name: ELIF,
        rawStatement,
      };

      if (ast.verifyStartTag(IF, tag)) {
        ast.between(tag);
      }

      return;
    }

    // start === '#'
    if (rawStatement) {
      ast.start({
        ...base,
        name: IF,
        rawStatement,
      });

      return;
    }

    return false;
  },

  async compile({ template, tag, context, out }, compileContent) {
    if (tag.name === IF) {
      const loc = out.pushLine(
        `if(${out.compileStatement((tag as StartTag).statement!, context)}){`,
      );
      await compileContent({ template, tag: tag as StartTag, context, out });
      return loc;
    }

    if (tag.name === ELIF) {
      const loc = out.pushLine(
        `}else if(${out.compileStatement((tag as StartTag).statement!, context)}){`,
      );
      await compileContent({ template, tag: tag as StartTag, context, out });
      return loc;
    }

    if (tag.name === ELSE) {
      if (
        tag.previousSibling?.name === IF ||
        tag.previousSibling?.name === ELIF
      ) {
        const loc = out.pushLine('}else{');
        await compileContent({ template, tag: tag as StartTag, context, out });
        return loc;
      }
    }

    if (tag.name === END_IF) {
      out.pushLine('}');
      return;
    }

    return false;
  },
};
