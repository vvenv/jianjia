import type { EngineOptions } from './types'
import { describe, expect, it } from 'vitest'
import { defaultOptions } from './engine'
import { OutScript } from './out-script'

function _out(options?: Partial<EngineOptions>) {
  return new OutScript({ ...defaultOptions, ...options })
}

it('escape \\', () => {
  const out = _out()
  out.pushStr(`\\`)
  expect(out.value).toMatchInlineSnapshot(`"s+="\\\\";"`)
})

it('escape \\n', () => {
  const out = _out()
  out.pushStr(`\n`)
  expect(out.value).toMatchInlineSnapshot(`"s+="\\n";"`)
})

it('escape "', () => {
  const out = _out()
  out.pushStr(`"`)
  expect(out.value).toMatchInlineSnapshot(`"s+="\\"";"`)
})

it('escape \\{{ ', () => {
  const out = _out()
  out.pushStr(`\\{{ x }}`)
  expect(out.value).toMatchInlineSnapshot(`"s+="{{ x }}";"`)
})

it('escape dynamic values with external function', () => {
  const out = _out()
  out.pushVar('x')
  expect(out.value).toMatchInlineSnapshot(`"s+=e(x);"`)
})

describe('compileStatement', () => {
  const out = _out()

  it('basic', () => {
    expect(
      out.compileStatement(
        [
          {
            type: 'expression',
            value: 'x',
          },
          {
            type: 'operator',
            value: '===',
          },
          {
            type: 'expression',
            value: 'y',
          },
        ],
        'c',
      ),
    ).toMatchInlineSnapshot(`"c.x===c.y"`)
  })

  it('not', () => {
    expect(
      out.compileStatement(
        [
          {
            type: 'expression',
            value: '!x',
          },
          {
            type: 'operator',
            value: 'in',
          },
          {
            type: 'expression',
            value: '!y',
          },
        ],
        'c',
      ),
    ).toMatchInlineSnapshot(`"!c.x in !c.y"`)
  })

  it('filter', () => {
    expect(
      out.compileStatement(
        [
          {
            type: 'expression',
            value: 'x',
            filters: [
              {
                name: 'f',
                args: '',
              },
            ],
          },
          {
            type: 'operator',
            value: '===',
          },
          {
            type: 'expression',
            value: 'y',
            filters: [
              {
                name: 'f',
                args: '',
              },
            ],
          },
        ],
        'c',
      ),
    ).toMatchInlineSnapshot(`"await f.f.call(c,c.x)===await f.f.call(c,c.y)"`)
  })

  it('filter w/ named args', () => {
    expect(
      out.compileStatement(
        [
          {
            type: 'expression',
            value: '!x',
            filters: [
              {
                name: 'f',
                args: '"a"',
              },
            ],
          },
          {
            type: 'operator',
            value: '===',
          },
          {
            type: 'expression',
            value: '!y',
            filters: [
              {
                name: 'f',
                args: '"a" `b`',
              },
            ],
          },
        ],
        'c',
      ),
    ).toMatchInlineSnapshot(
      `"await f.f.call(c,!c.x,"a")===await f.f.call(c,!c.y,"a",\`b\`)"`,
    )
    expect(
      out.compileStatement(
        [
          {
            type: 'expression',
            value: '!x',
            filters: [
              {
                name: 'f',
                args: 'a="a"',
              },
            ],
          },
          {
            type: 'operator',
            value: '===',
          },
          {
            type: 'expression',
            value: '!y',
            filters: [
              {
                name: 'f',
                args: 'a=a b=`b`',
              },
            ],
          },
        ],
        'c',
      ),
    ).toMatchInlineSnapshot(
      `"await f.f.call(c,!c.x,{a:"a"})===await f.f.call(c,!c.y,{a:c.a,b:\`b\`})"`,
    )
  })
})
