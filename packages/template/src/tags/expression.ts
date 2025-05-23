import { StartTag } from '../ast';
import { hasKeyword } from '../utils/has-keyword';
import { isLiteral } from '../utils/is-literal';
import { isEvil } from '../utils/is-evil';
import { isExpression } from '../utils/is-expression';
import { isExpressionWithFilters } from '../utils/is-expression-with-filters';
import { isTag } from '../utils/is-tag';
import { parseStatement } from '../utils/parse-statement';
import { Tag } from '../types';
import { isLiteralWithFilters } from '../utils/is-literal-with-filters';

const EXPRESSION = 'expression';
const END_EXPRESSION = 'end_expression';

/**
 * @example {{ x | f }}
 * @example {{ 'a' if x else 'b' }}
 */
export const tag: Tag = {
  priority: -10,

  parse({ ast, base, content }) {
    if (verifyExpression(content)) {
      ast.start({
        ...base,
        name: EXPRESSION,
        rawStatement: content,
      });

      // Self closing
      ast.end({
        ...base,
        startIndex: base.endIndex,
        name: END_EXPRESSION,
      });

      return;
    }

    return false;
  },

  compile({ tag, context, out }) {
    if (tag.name === EXPRESSION) {
      const statement0 = (tag as StartTag).statement![0];
      const [, a, cond, b] =
        statement0.value.match(/^(.+?)\sif\s(.+?)(?:\s+else\s(.+?))?$/) ?? [];
      if (cond) {
        return out.pushVar(
          `${out.compileStatement(parseStatement(cond), context)} ? ${out.compileStatement(parseStatement(a), context)} : ${b ? out.compileStatement(parseStatement(b), context) : '""'}`,
        );
      }
      return out.pushVar(
        out.compileStatement(
          [
            {
              ...statement0,
              value: out.unescapeTag(statement0.value),
            },
          ],
          context,
        ),
      );
    }

    if (tag.name === END_EXPRESSION) {
      return;
    }

    return false;
  },
};

function verifyExpression(rawStatement: string) {
  return (
    (isLiteral(rawStatement) ||
      isExpression(rawStatement) ||
      isLiteralWithFilters(rawStatement) ||
      isExpressionWithFilters(rawStatement)) &&
    !(isTag(rawStatement) || isEvil(rawStatement) || hasKeyword(rawStatement))
  );
}
