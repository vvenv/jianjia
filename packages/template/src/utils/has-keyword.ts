import { isKeyword } from './is-keyword'

/**
 * Check if a value contains a keyword.
 */
export function hasKeyword(value: string) {
  return value
    .replace(/(['"`])(?:\\\1|(?!\1).)*?\1/g, '')
    .split(/ +/)
    .some(isKeyword)
}
