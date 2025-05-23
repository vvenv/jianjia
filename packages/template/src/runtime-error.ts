import { SourceMap } from './source-map';
import { highlightSource } from './utils/highlight-source';

interface RuntimeErrorOptions {
  source: string;
  error: Error;
  sourcemap: SourceMap;
}

export class RuntimeError extends Error {
  constructor(
    message: string,
    private options: RuntimeErrorOptions,
  ) {
    super(message);
    this.name = 'RuntimeError';
    Error.captureStackTrace?.(this, this.constructor);
  }

  get details() {
    const tags = this.options.sourcemap.getTags(
      +(this.options.error.stack!.match(/<anonymous>:\d:(\d+)\)/)?.[1] ?? 0),
    );

    return highlightSource(this.message, this.options.source, tags);
  }
}
