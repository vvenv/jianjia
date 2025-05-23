import { isExpression } from './is-expression';

/**
 * Loosely check if a value is a expression with filters.
 */
export function isExpressionWithFilters(value: string) {
  const [, expression, filters] = value.match(/^([\s\S]+?)\s(\|.+)$/) || [];
  return !!expression && !!filters && isExpression(expression);
}
