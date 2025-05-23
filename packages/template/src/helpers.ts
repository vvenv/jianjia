import type { ObjectType } from './types'

export function getIn(obj: any[] | ObjectType, index: number, key: string) {
  return Array.isArray(obj) ? obj[index] : obj[key]
}
