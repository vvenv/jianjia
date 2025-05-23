/**
 * Check if a value is a keyword.
 */
export function isKeyword(value: string) {
  return /\b(?:abstract|as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|enum|export|extends|finally|for|from|function|get|global|implements|import|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|window|while|with|yield)\b/.test(
    value,
  )
}
