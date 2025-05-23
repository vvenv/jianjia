import type { EngineOptions } from './types'
import { Engine } from './engine'

export * from './ast'
export * from './config'
export * from './engine'
export * from './out-script'
export * from './parser'
export * from './safe'
export * from './source-map'
export * from './tags'
export type * from './types'
export * from './utils'

export async function template(template: string, data: object, options?: EngineOptions) {
  return (await new Engine(options).compile(template)).render(data)
}
