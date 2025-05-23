import type { FilterMeta } from '../types'
import { parseFilter } from './parse-filter'

/**
 * Parse an expression with optional filters.
 * @example {{ x | replace: "a", "," }}
 *             ^   ^^^^^^^  ^^^  ^^^
 */
export function parseExpression(template: string) {
  const [, value, rest] = template.match(/^(.+?)( \| [a-z$_].*)?$/ms)!

  if (!rest) {
    return { value }
  }

  const filters: FilterMeta[] = []
  const filterRe = / \| ([a-z$_][^|]*?)(?= \||$)/gi

  let match
  // eslint-disable-next-line no-cond-assign
  while ((match = filterRe.exec(rest))) {
    const [, filter] = match
    filters.push(parseFilter(filter))
  }

  return {
    value,
    filters,
  }
}
