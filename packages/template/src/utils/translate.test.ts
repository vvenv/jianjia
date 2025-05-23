import { expect, it } from 'vitest'
import { translate } from './translate'

const translations = {
  'Hello {name}': '你好 {name}',
  'Simple text': '简单文本',
  '{user} has {count} messages': '{user} 有 {count} 条消息',
}

it('should return original text when translations is empty', () => {
  expect(translate({}, 'Hello world', {})).toBe('Hello world')
})

it('should return original text when translation not found', () => {
  expect(translate(translations, 'Not exists', {})).toBe('Not exists')
})

it('should translate simple text without parameters', () => {
  expect(translate(translations, 'Simple text', {})).toBe('简单文本')
})

it('should translate text with single parameter', () => {
  expect(translate(translations, 'Hello {name}', { name: 'World' })).toBe(
    '你好 World',
  )
})

it('should translate text with multiple parameters', () => {
  expect(
    translate(translations, '{user} has {count} messages', {
      user: 'John',
      count: '3',
    }),
  ).toBe('John 有 3 条消息')
})

it('should handle missing parameters gracefully', () => {
  expect(translate(translations, 'Hello {name}', {})).toBe('你好 {name}')
  expect(
    translate(translations, '{user} has {count} messages', { user: 'John' }),
  ).toBe('John 有 {count} 条消息')
})

it('should handle extra parameters by ignoring them', () => {
  expect(
    translate(translations, 'Hello {name}', {
      name: 'World',
      extra: 'ignored',
    }),
  ).toBe('你好 World')
})

it('should translate text with key and single parameter', () => {
  expect(translate(translations, '你好 {name}', { name: '世界' })).toBe(
    '你好 世界',
  )
})
