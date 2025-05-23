/**
 * Check if a string value is a number literal.
 */
export function isNumber(value: string) {
  // eslint-disable-next-line unicorn/prefer-number-properties
  return !isNaN(value as unknown as number)
}
