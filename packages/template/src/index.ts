import { Engine } from './engine';
import { EngineOptions } from './types';

export * from './ast';
export * from './config';
export * from './engine';
export * from './utils';
export * from './out-script';
export * from './parser';
export * from './safe';
export * from './source-map';
export * from './tags';
export type * from './types';

export const template = async (
  template: string,
  data: object,
  options?: EngineOptions,
) => (await new Engine(options).compile(template)).render(data);
