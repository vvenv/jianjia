/**
 * Loosely check if a value is a expression.
 */
export function isExpression(value: string) {
  return (
    /^[\w$.:+\-*/%[\]'"`\s]+$/ms.test(value) && !/^\w+\s+[\w'"`]+/ms.test(value)
  );
}
