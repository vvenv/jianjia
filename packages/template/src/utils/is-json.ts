/**
 * Check if a string value is a JSON literal.
 */
export function isJSON(value: string) {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}
