/**
 * Check if a value is dangerous.
 */
export function isEvil(value: string) {
  return (
    /(?:(?:window|global)\.)?(?:eval|alert|confirm|prompt|console)/.test(
      value,
    ) || /^<|>$/m.test(value)
  )
}
