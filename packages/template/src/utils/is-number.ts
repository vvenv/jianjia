/**
 * Check if a string value is a number literal.
 */
export function isNumber(value: string) {
  return !isNaN(value as unknown as number);
}
