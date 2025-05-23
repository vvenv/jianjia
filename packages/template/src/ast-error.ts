import type { Location } from './types'
import { highlightSource } from './utils/highlight-source'

interface ASTErrorOptions {
  template: string
  tags: Location[]
}

export class ASTError extends SyntaxError {
  constructor(
    message: string,
    private options: ASTErrorOptions,
  ) {
    super(message)
    this.name = 'ASTError'
    SyntaxError.captureStackTrace?.(this, this.constructor)
  }

  get details() {
    return highlightSource(
      this.message,
      this.options.template,
      this.options.tags,
    )
  }
}
