import { FILTERS } from '../config';
import { isLiteral } from './is-literal';
import { parseActualArgs } from './parse-actual-args';
import { FilterMeta } from './parse-filter';

/**
 * Returns the expression with filters applied
 */
export function compileExpression(
  value: string,
  context: string,
  filters?: FilterMeta[],
) {
  let identifier = isLiteral(value) ? value : addContext(value, context);

  if (filters?.length) {
    for (const { name, args } of filters) {
      const argStr = [identifier, ...parseActualArgs(args, context)].join(',');
      identifier = `await ${FILTERS}.${name}.call(${context},${argStr})`;
    }
  }

  return identifier;
}

/**
 * Find non-literal strings and add context to them
 */
function addContext(value: string, context: string) {
  function _addContext(str: string) {
    return str
      .replace(/\bnot\s+/g, '!')
      .replace(/([a-z$_][\w$_]*(?:\.[a-z$_][\w$_]*)*)/gi, `${context}.$1`);
  }

  const re = /(["'`])((?:\\\1|(?!\1).)*?)\1/g;

  let ret = '';
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(value))) {
    ret += _addContext(value.slice(cursor, match.index));
    ret += match[0];
    cursor = re.lastIndex;
  }

  return ret + _addContext(value.slice(cursor));
}
