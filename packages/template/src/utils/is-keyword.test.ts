import { expect, it } from 'vitest'
import { isKeyword } from './is-keyword'

it('basic', () => {
  'abstract|as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|enum|export|extends|finally|for|from|function|get|global|implements|import|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|window|with|yield'
    .split('|')
    .forEach((keyword) => {
      expect(isKeyword(keyword)).toBe(true)
      expect(isKeyword(`${keyword}(`)).toBe(true)
      expect(isKeyword(`_${keyword}`)).toBe(false)
    })
})
