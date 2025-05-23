import { expect, test } from 'vitest';
import { hasKeyword } from './has-keyword';

test('basic', () => {
  'abstract|as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|enum|export|extends|finally|for|from|function|get|implements|import|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield'
    .split('|')
    .forEach((keyword) => {
      expect(hasKeyword(keyword)).toBe(true);
      expect(hasKeyword(`"${keyword}"`)).toBe(false);
    });
  expect(hasKeyword(`abstract class`)).toBe(true);
  expect(hasKeyword(`"abstract class"`)).toBe(false);
});
