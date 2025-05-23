import { isLiteral } from './is-literal';

/**
 * Loosely check if a value is a literal with filters.
 */
export function isLiteralWithFilters(value: string) {
  const [, literal, filters] = value.match(/^([\s\S]+?)\s(\|.+)$/) || [];
  return !!literal && !!filters && isLiteral(literal);
}
