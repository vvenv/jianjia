import { formatDatetime } from './utils/format-datetime';
import { translate } from './utils/translate';
import { Safe } from './safe';
import { Globals } from './types';
export * from './escape';

type ObjectType = {
  [key: string]: any;
};

export function abs(this: Globals, value = 0) {
  return Math.abs(value);
}
export function capitalize(this: Globals, value = '') {
  return value.replace(/\b\w/g, (match) => match.toUpperCase());
}
export function add(this: Globals, value = 0, addend = 0) {
  return value + addend;
}
export function date(
  this: Globals,
  value: string | number = 0,
  format = 'yy-MM-dd hh:mm',
) {
  return formatDatetime(this.translations, value, format);
}
export function entries(this: Globals, value: ObjectType = {}) {
  return Object.entries(value);
}
export function even(this: Globals, value: number | string = 0) {
  return +value % 2 === 0;
}
export function fallback(this: Globals, value = '', defaultValue: any) {
  return value || defaultValue;
}
export function first(this: Globals, value: string | any[] = []) {
  return [...value][0];
}
export function groupby(this: Globals, value: ObjectType[] = [], key: string) {
  return value.reduce(
    (o, v) => {
      const k = v[key];
      return {
        ...o,
        [k]: [...(o[k] || []), v],
      };
    },
    {} as Record<string, ObjectType[]>,
  );
}
export function join(
  this: Globals,
  value: string | string[] = [],
  separator = '',
) {
  return [...value].join(separator);
}
export function json(this: Globals, value: any = null, indent = 0) {
  return new Safe(JSON.stringify(value, null, indent));
}
export function keys(this: Globals, value: ObjectType = {}) {
  return Object.keys(value);
}
export function last(this: Globals, value: string | any[] = []) {
  return [...value].reverse()[0];
}
export function length(this: Globals, value = '') {
  return value.length;
}
export function lower(this: Globals, value = '') {
  return value.toLowerCase();
}
export function map(
  this: Globals,
  value: ObjectType[] = [],
  key: string,
  defaultValue?: any,
) {
  return value.map((o) => o[key] ?? defaultValue);
}
export function max(this: Globals, value = 0, ...values: number[]) {
  return Math.max(value, ...values);
}
export function min(this: Globals, value = 0, ...values: number[]) {
  return Math.min(value, ...values);
}
export function minus(this: Globals, value = 0, minuend = 0) {
  return value - minuend;
}
export function odd(this: Globals, value: number | string = 0) {
  return +value % 2 === 1;
}
export function omit(this: Globals, value: ObjectType = {}, ...keys: string[]) {
  return Object.entries(value).reduce(
    (o, [k, v]) => (keys.includes(k) ? o : { ...o, [k]: v }),
    {},
  );
}
export function pick(this: Globals, value: ObjectType = {}, ...keys: string[]) {
  return keys.reduce((o, k) => ({ ...o, [k]: value[k] }), {});
}
export function repeat(this: Globals, value = '', count = 0) {
  return value.repeat(count);
}
export function replace(
  this: Globals,
  value = '',
  search: string,
  replace: string,
) {
  return value.replace(new RegExp(search, 'g'), replace);
}
export function reverse(this: Globals, value: string | any[] = []) {
  return Array.isArray(value) ? value.reverse() : [...value].reverse().join('');
}
export function safe(this: Globals, value = '') {
  return new Safe(value);
}
export function slice(this: Globals, value = '', start = 0, end?: number) {
  return value.slice(start, end);
}
export function sort(this: Globals, value: string | any[] = []) {
  return Array.isArray(value) ? value.sort() : [...value].sort().join('');
}
export function split(this: Globals, value = '', separator = '') {
  return value.split(separator);
}
export function sum(this: Globals, value: number[] = []) {
  return value.reduce((a, b) => a + b, 0);
}
export function t(this: Globals, value: string, params?: Record<string, any>) {
  return translate(this.translations, value, params);
}
export function time(
  this: Globals,
  value: string | number = 0,
  format = 'hh:mm',
) {
  return formatDatetime(this.translations, value, format);
}
export function trim(this: Globals, value = '') {
  return value.trim();
}
export function unique(this: Globals, value: string | any[] = '') {
  return Array.isArray(value)
    ? Array.from(new Set(value))
    : Array.from(new Set(value)).join('');
}
export function upper(this: Globals, value = '') {
  return value.toUpperCase();
}
export function values(this: Globals, value: ObjectType = {}) {
  return Object.values(value);
}
