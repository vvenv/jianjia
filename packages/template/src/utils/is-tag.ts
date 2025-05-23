/**
 * Check if a value is start or and tag.
 */
export function isTag(value: string) {
  return /^[#/]/.test(value);
}
