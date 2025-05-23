import type { SourceMap } from './source-map'
import type { EngineOptions, Filters, Globals, ParsedFunction, Tag } from './types'
import { escape } from './escape'
import * as filters from './filters'
import * as helpers from './helpers'
import { loader } from './loaders/url-loader'
import { Parser } from './parser'
import { RuntimeError } from './runtime-error'
import { Safe } from './safe'

export const defaultOptions: Required<EngineOptions> = {
  debug: false,
  globals: {
    translations: {},
  },
  filters: {},
  tags: [],
  autoEscape: true,
  strictMode: true,
  stripComments: true,
  loader,
}

export class Engine {
  protected options: Required<EngineOptions>
  protected parser: Parser
  private globals: Globals = {}
  private filters: Filters = {}

  constructor(options?: EngineOptions) {
    this.options = { ...defaultOptions, ...options }

    this.parser = new Parser(this.options)

    this.registerGlobals(this.options.globals)
    this.registerFilters(this.options.filters)
    this.registerTags(this.options.tags)
  }

  registerGlobals(globals: Globals) {
    Object.assign(this.globals, globals)
  }

  registerFilters(filters: Filters) {
    Object.assign(this.filters, filters)
  }

  registerTags(tags: Tag[]) {
    this.parser.registerTags(tags)
  }

  async compile(template: string): Promise<{
    script: ParsedFunction
    render: (globals: Globals) => Promise<string>
  }> {
    const { script, sourcemap } = await this.parser.parse(
      await this.handlePartial(template),
    )

    return {
      script,
      render: async (globals: Globals): Promise<string> => {
        return this.render(globals, script, template, sourcemap)
      },
    }
  }

  async render(
    globals: Globals,
    func: ParsedFunction,
    template: string,
    sourcemap: SourceMap,
  ): Promise<string> {
    try {
      return await func(
        { ...this.globals, ...globals },
        { ...filters, ...this.filters },
        (v: unknown) => {
          if (v instanceof Safe) {
            return `${v}`
          }
          return this.options.autoEscape ? escape(v) : v
        },
        helpers,
      )
    }
    catch (error: any) {
      if (this.options.debug) {
        throw new RuntimeError(error.message, {
          source: template,
          error,
          sourcemap,
        })
      }

      return ''
    }
  }

  private async handlePartial(template: string) {
    const partialRe
      = /\{\{ (layout|include) (['"`])((?:\\\2|(?!\2).)*)\2 \}\}/gs
    let match
    // eslint-disable-next-line no-cond-assign
    while ((match = partialRe.exec(template))) {
      const [, type, , name] = match

      if (type === 'layout') {
        const layout = await this.options.loader!(`layouts/${name}.jianjia`)

        template
          = template.slice(0, match.index)
            + layout
            + template.slice(match.index + match[0].length)
      }
      else if (type === 'include') {
        const partial = await this.options.loader!(`partials/${name}.jianjia`)
        template
          = template.slice(0, match.index)
            + partial
            + template.slice(match.index + match[0].length)
      }
    }

    return template
  }
}
