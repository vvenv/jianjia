import { StartTag } from '../ast';
import { Tag } from '../types';

const ASSIGN = 'assign';
const END_ASSIGN = 'end_assign';
const RE =
  /^assign\s+([a-z$_][\w$_]*(?:,\s+[a-z$_][\w$_]*)*)\s+=\s+((['"`])(?:\\\3|(?!\3).)*\3|[^=]+)$/i;

/**
 * @example {{ assign my_var = my_obj }}
 */
export const tag: Tag = {
  parse({ ast, base, content }) {
    const [, variable, rawStatement] = content.match(RE) ?? [];

    if (rawStatement) {
      ast.start({
        ...base,
        name: ASSIGN,
        data: variable,
        rawStatement,
      });

      // Self closing
      ast.end({
        ...base,
        startIndex: base.endIndex,
        name: END_ASSIGN,
      });

      return;
    }

    return false;
  },

  compile({ tag, context, out }) {
    if (tag.name === ASSIGN) {
      const { data: value, statement: statements } = tag as StartTag;
      const object = out.compileStatement(statements, context);
      const names = (value as string).split(/,\s+/);
      const lines: string[] = [];
      lines.push(`Object.assign(${context},{`);
      if (names.length > 1) {
        names.forEach((key, index) => {
          lines.push(`${index > 0 ? ',' : ''}${key}:${object}.${key}`);
        });
      } else {
        lines.push(`${value}:${object}`);
      }
      lines.push(`});`);
      return out.pushLine(...lines);
    }

    if (tag.name === END_ASSIGN) {
      return;
    }

    return false;
  },
};
