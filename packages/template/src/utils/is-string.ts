/**
 * Check if a string value is a string literal.
 */
export function isString(value: string) {
  return /^(['"`])(?:\\\1|(?!\1).)*\1$/ms.test(value)
}
