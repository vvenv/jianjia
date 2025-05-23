import { TAG_END, TAG_START } from './config';
import * as filters from './filters';
import { escape } from './escape';
import { Parser } from './parser';
import { Safe } from './safe';
import { Globals, Tag, EngineOptions, ParsedFunction, Filters } from './types';
import { RuntimeError } from './runtime-error';
import { SourceMap } from './source-map';
import { loader } from './loaders/url-loader';

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
  start: TAG_START,
  end: TAG_END,
  loader,
};

export class Engine {
  protected options: Required<EngineOptions>;
  protected parser: Parser;
  private globals: Globals = {};
  private filters: Filters = {};

  constructor(options?: EngineOptions) {
    this.options = { ...defaultOptions, ...options };

    this.parser = new Parser(this.options);

    this.registerGlobals(this.options.globals);
    this.registerFilters(this.options.filters);
    this.registerTags(this.options.tags);
  }

  registerGlobals(globals: Globals) {
    Object.assign(this.globals, globals);
    return this;
  }

  registerFilters(filters: Filters) {
    Object.assign(this.filters, filters);
    return this;
  }

  registerTags(tags: Tag[]) {
    this.parser.registerTags(tags);
    return this;
  }

  async compile(template: string): Promise<{
    script: ParsedFunction;
    render: (globals: Globals) => Promise<string>;
  }> {
    const { script, sourcemap } = await this.parser.parse(
      await this.handlePartial(template),
    );

    return {
      script,
      render: async (globals: Globals): Promise<string> => {
        return this.render(globals, script, template, sourcemap);
      },
    };
  }

  async render(
    globals: Globals,
    func: ParsedFunction,
    template: string,
    sourcemap: SourceMap,
  ): Promise<string> {
    try {
      return await func.call(
        null,
        { ...this.globals, ...globals },
        { ...filters, ...this.filters },
        (v: unknown) => {
          if (v instanceof Safe) {
            return `${v}`;
          }
          return this.options.autoEscape ? escape(v) : v;
        },
      );
    } catch (error: any) {
      if (this.options.debug) {
        throw new RuntimeError(error.message, {
          source: template,
          error,
          sourcemap,
        });
      }

      return '';
    }
  }

  private async handlePartial(template: string) {
    const {
      options: { start, end },
    } = this;

    const partialRe = new RegExp(
      `${start}\\s(layout|include)\\s(['"\`])((?:\\\\\\2|(?!\\2).)*)\\2\\s${end}`,
      'gms',
    );
    let match;
    while ((match = partialRe.exec(template))) {
      const [, type, , name] = match;

      if (type === 'layout') {
        const layout = await this.options.loader!(`layouts/${name}.jianjia`);

        template =
          template.slice(0, match.index) +
          layout +
          template.slice(match.index + match[0].length);
      } else if (type === 'include') {
        const partial = await this.options.loader!(`partials/${name}.jianjia`);
        template =
          template.slice(0, match.index) +
          partial +
          template.slice(match.index + match[0].length);
      }
    }

    return template;
  }
}
