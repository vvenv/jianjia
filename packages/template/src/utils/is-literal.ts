import { isNumber } from './is-number'
import { isString } from './is-string'

/**
 * Check if a value is a literal.
 */
export function isLiteral(value: string) {
  return (
    value === 'true'
    || value === 'false'
    || value === 'null'
    || value === 'undefined'
    // String
    || isString(value)
    // Number
    || isNumber(value)
  )
}
