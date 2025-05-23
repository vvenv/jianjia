import { expect, test } from 'vitest';
import { ASTError } from './ast-error';

test('ASTError', () => {
  const error = new ASTError('test error', {
    template: '{{ #if }}{{ else }}{{ /if }}',
    tags: [
      {
        startIndex: 0,
        endIndex: 9,
      },
      {
        startIndex: 19,
        endIndex: 28,
      },
    ],
  });

  expect(error.name).toBe('ASTError');
  expect(error.message).toBe('test error');
  expect(error.details).toMatchInlineSnapshot(`
    " JianJia  test error

    1: {{ #if }}{{ else }}{{ /if }}
       ^^^^^^^^^
                          ^^^^^^^^^
    "
  `);
});
