/**
 * Parse formal parameters.
 * @example `{{ macro x a b="foo" }}`
 *                     ^ ^^^^^^^
 */
export function parseFormalArgs(statement: string) {
  if (!statement) {
    return [];
  }

  const args: string[] = [];
  const argRe =
    /((?:[a-z$_][\w$_]*=)?(?:(['"`])(?:(?:\\\2|(?!\2).)*?)\2)|(?:[^'"`\s]+))/gi;

  let match;
  while ((match = argRe.exec(statement))) {
    const [, arg] = match;
    args.push(arg);
  }

  return args;
}
