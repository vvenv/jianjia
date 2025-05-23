import { defaultOptions, Engine } from '../src/engine';
import { Parser } from '../src/parser';
import { Tag, EngineOptions } from '../src/types';

export const parse = async (
  template: string,
  options?: EngineOptions,
  tags?: Tag[],
): Promise<any> => {
  if (options?.debug && !(options as any).__debug) {
    (options as any).__debug = true;
    return await (async () => {
      try {
        return await parse(template, options);
      } catch (error: any) {
        return error.details ?? error.message;
      }
    })();
  }

  const parser = new Parser({ ...defaultOptions, ...options });
  if (tags) parser.registerTags(tags);
  const { value } = await parser.parse(template);
  return value;
};

export const compile = async (
  input: string,
  options?: EngineOptions,
): Promise<any> => {
  if (options?.debug && !(options as any).__debug) {
    (options as any).__debug = true;
    return await (async () => {
      try {
        return await compile(input, options);
      } catch (error: any) {
        return error.details;
      }
    })();
  }

  return new Engine(options).compile(input);
};

export const render = async (
  input: string,
  data: Record<string, any>,
  options?: EngineOptions,
): Promise<any> => {
  if (options?.debug && !(options as any).__debug) {
    (options as any).__debug = true;
    return await (async () => {
      try {
        return await render(input, data, options);
      } catch (error: any) {
        return error.details;
      }
    })();
  }

  return (await compile(input, options)).render(data);
};
