export interface FilterMeta {
  name: string;
  args: string;
}

/**
 * Parse a filter with optional parameters.
 * @example replace a b
 *          ^^^^^^^ ^^^
 * @example replace a=b
 *          ^^^^^^^ ^^^
 */
export function parseFilter(filter: string): FilterMeta {
  const [, name, args] = filter.match(/^([a-z$_][\w$_]*)(?:\s+(.+?))?$/i)!;

  return {
    name,
    args,
  };
}
