import { FilterMeta, parseFilter } from './parse-filter';

/**
 * Parse an expression with optional filters.
 * @example {{ x | replace "a" "," }}
 *             ^   ^^^^^^^ ^^^ ^^^
 */
export function parseExpression(template: string) {
  const [, value, rest] = template.match(/^(.+?)(\s\|\s[a-z$_].*)?$/ms)!;

  if (!rest) {
    return { value };
  }

  const filters: FilterMeta[] = [];
  const filterRe = /\s\|\s([a-z$_][^|]*?)(?=\s\||$)/gi;

  let match;
  while ((match = filterRe.exec(rest))) {
    const [, filter] = match;
    filters.push(parseFilter(filter));
  }

  return {
    value,
    filters,
  };
}
