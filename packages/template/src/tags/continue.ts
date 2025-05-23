import { Tag } from '../types';
import { FOR } from './for';

const CONTINUE = 'continue';
const END_CONTINUE = 'end_continue';
const RE = /^continue$/;

/**
 * @example {{ continue }}
 */
export const tag: Tag = {
  parse({ ast, base, content }) {
    if (content.match(RE)) {
      const tag = {
        ...base,
        name: CONTINUE,
      };

      if (ast.verifyAncestorStartTag(FOR, tag)) {
        ast.start(tag);

        // Self closing
        ast.end({
          ...base,
          startIndex: base.endIndex,
          name: END_CONTINUE,
        });

        return;
      }
    }

    return false;
  },

  compile({ tag, out }) {
    if (tag.name === CONTINUE) {
      return out.pushLine('continue;');
    }

    if (tag.name === END_CONTINUE) {
      return;
    }

    return false;
  },
};
