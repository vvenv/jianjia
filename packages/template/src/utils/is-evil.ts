/**
 * Check if a value is dangerous.
 */
export function isEvil(value: string) {
  return (
    /(?:window\.)?(?:eval|alert|confirm|prompt|console)/ms.test(value) ||
    /^<|>$/ms.test(value)
  );
}
