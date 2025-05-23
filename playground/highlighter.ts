export async function codeToHtml(code: string, lang: string) {
  const { createHighlighterCore } = await import('shiki/core')
  const { createOnigurumaEngine } = await import('shiki/engine/oniguruma')

  const highlighter = await createHighlighterCore({
    themes: [import('shiki/themes/one-dark-pro.mjs')],
    langs: [
      import('shiki/langs/javascript.mjs'),
      import('shiki/langs/html.mjs'),
    ],
    // `shiki/wasm` contains the wasm binary inlined as base64 string.
    engine: createOnigurumaEngine(import('shiki/wasm')),
  })

  return highlighter.codeToHtml(code, {
    lang,
    theme: 'one-dark-pro',
  })
}
