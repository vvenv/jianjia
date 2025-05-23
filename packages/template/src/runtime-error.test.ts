import { expect, test } from 'vitest';
import { RuntimeError } from './runtime-error';

test('RuntimeError', () => {
  const error = new RuntimeError('test error', {
    source: '{{ #if }}{{ else }}{{ /if }}',
    error: {
      stack: '<anonymous>:1:1)',
    } as any,
    sourcemap: {
      getTags: (index: number) =>
        index === 1
          ? [
              {
                startIndex: 0,
                endIndex: 7,
              },
              {
                startIndex: 15,
                endIndex: 22,
              },
            ]
          : [],
    } as any,
  });

  expect(error.name).toBe('RuntimeError');
  expect(error.message).toBe('test error');
  expect(error.details).toMatchInlineSnapshot(`
    " JianJia  test error

    1: {{ #if }}{{ else }}{{ /if }}
       ^^^^^^^
                      ^^^^^^^
    "
  `);
});

test('RuntimeError w/ missed', () => {
  const error = new RuntimeError('test error', {
    source: '{{ #if }}{{ else }}{{ /if }}',
    error: {
      stack: '',
    } as any,
    sourcemap: {
      getTags: (index: number) =>
        index === 1
          ? [
              {
                startIndex: 0,
                endIndex: 7,
              },
              {
                startIndex: 15,
                endIndex: 22,
              },
            ]
          : [],
    } as any,
  });

  expect(error.name).toBe('RuntimeError');
  expect(error.message).toBe('test error');
  expect(error.details).toMatchInlineSnapshot(`
    " JianJia  test error

       ...
    "
  `);
});
