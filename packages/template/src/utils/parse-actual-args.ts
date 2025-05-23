import { compileExpression } from './compile-expression';
import { isLiteral } from './is-literal';

/**
 * Parse actual parameters.
 * @example {{ x | replace a="b" }}
 *                         ^^^^^
 * @example {{ x | replace a "b" }}
 *                         ^^^^^
 */
export function parseActualArgs(statement: string, context: string) {
  if (!statement) {
    return [];
  }

  const kvArgs: string[] = [];
  const args: string[] = [];
  let match;

  const argRe =
    /(?:([a-z$_][\w$_]*)=)?(?:(?:(['"`])((?:\\\2|(?!\2).)*?)\2|([^'"`\s]+)))/gi;

  while ((match = argRe.exec(statement))) {
    const [, name, quote, literal, arg] = match;

    if (!name) {
      args.push(
        quote
          ? `${quote}${literal}${quote}`
          : isLiteral(arg)
            ? arg
            : compileExpression(arg, context),
      );
      continue;
    }

    kvArgs.push(kvArgs.length ? ',' : '{');
    kvArgs.push(
      `${name}:${
        quote
          ? `${quote}${literal}${quote}`
          : isLiteral(arg)
            ? arg
            : parseActualArgs(arg, context)
      }`,
    );
  }

  if (kvArgs.length) {
    kvArgs.push('}');
    return [kvArgs.join('')];
  }

  return args;
}
