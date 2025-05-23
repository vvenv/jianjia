import type { FilterMeta } from '../types'

/**
 * Parse a filter with optional parameters.
 * @example replace a b
 *          ^^^^^^^ ^^^
 * @example replace a=b
 *          ^^^^^^^ ^^^
 */
export function parseFilter(filter: string): FilterMeta {
  const [, name, args] = filter.match(/^([a-z$_][\w$]*)(?:: (.+))?$/i)!

  return {
    name,
    args,
  }
}
