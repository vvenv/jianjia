import { expect, it } from 'vitest'
import { Safe } from './safe'

it('number', () => {
  expect(new Safe(1).toString()).toMatchInlineSnapshot(`"1"`)
  expect(new Safe(1.1).toString()).toMatchInlineSnapshot(`"1.1"`)
  expect(new Safe('1').toString()).toMatchInlineSnapshot(`"1"`)
  expect(new Safe(true).toString()).toMatchInlineSnapshot(`"true"`)
  expect(new Safe(false).toString()).toMatchInlineSnapshot(`"false"`)
  expect(new Safe([]).toString()).toMatchInlineSnapshot(`""`)
  expect(new Safe({}).toString()).toMatchInlineSnapshot(`"[object Object]"`)
  expect(new Safe(undefined).toString()).toMatchInlineSnapshot(`"undefined"`)
  expect(new Safe(null).toString()).toMatchInlineSnapshot(`"null"`)
  expect(new Safe(/\d/).toString()).toMatchInlineSnapshot(`"/\\d/"`)
})
