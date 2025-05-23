import { isLiteral } from './is-literal';
import { parseExpression } from './parse-expression';
import { FilterMeta } from './parse-filter';

export interface Statement {
  type: 'expression' | 'operator';
  value: string;
  filters?: FilterMeta[];
}

export const operators = {
  and: '&&',
  or: '||',
  eq: '===',
  ne: '!==',
  gt: '>',
  ge: '>=',
  lt: '<',
  le: '<=',
  in: 'in',
  '&&': '&&',
  '||': '||',
  '===': '===',
  '!==': '!==',
  '==': '==',
  '!=': '!=',
  '=': '=',
};

// First level operators
const operatorRe = /\s(and|or|eq|ne|gt|ge|lt|le|in|&&|\|\||===|!==|==|!=|=)\s/g;

export function parseStatement(template: string): Statement[] {
  if (isLiteral(template)) {
    return [
      {
        type: 'expression',
        value: template,
      },
    ];
  }

  const statements: Statement[] = [];

  let cursor = 0;
  let match: RegExpExecArray | null;
  operatorRe.lastIndex = 0;

  while ((match = operatorRe.exec(template))) {
    statements.push({
      type: 'expression',
      ...parseExpression(template.slice(cursor, match.index)),
    });
    statements.push({
      type: 'operator',
      value: (operators as any)[match[1]],
    });
    cursor = operatorRe.lastIndex;
  }

  statements.push({
    type: 'expression',
    ...parseExpression(template.slice(cursor)),
  });

  return statements;
}
