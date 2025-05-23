import { Tag } from '../types';
import { FOR } from './for';

const BREAK = 'break';
const END_BREAK = 'end_break';
const RE = /^break$/;

/**
 * @example {{ break }}
 */
export const tag: Tag = {
  parse({ ast, base, content }) {
    if (content.match(RE)) {
      const tag = {
        ...base,
        name: BREAK,
      };

      if (ast.verifyAncestorStartTag(FOR, tag)) {
        ast.start(tag);

        // Self closing
        ast.end({
          ...base,
          startIndex: base.endIndex,
          name: END_BREAK,
        });

        return;
      }
    }

    return false;
  },

  compile({ tag, out }) {
    if (tag.name === BREAK) {
      return out.pushLine('break;');
    }

    if (tag.name === END_BREAK) {
      return;
    }

    return false;
  },
};
