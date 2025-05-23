/**
 * Parse formal parameters.
 * @example `a, b="foo"`
 *           ^  ^^^^^^^
 */
export function parseFormalArgs(statement: string) {
  const args: string[] = []
  const argRe
    = /(?:, )?((?:[a-z$_][\w$]*=)?(['"`])(?:\\\2|(?!\2).)*?\2|[^'"`,\s]+)/gi

  let match
  // eslint-disable-next-line no-cond-assign
  while ((match = argRe.exec(statement))) {
    const [, arg] = match
    args.push(arg)
  }

  return args
}
