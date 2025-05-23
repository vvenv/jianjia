import Convert from 'ansi-to-html'
import { codeToHtml } from './highlighter'

declare global {
  interface Window {
    prettier: any
    prettierPlugins: any
  }
}

function loadScript(url: string) {
  const script = document.createElement('script')
  script.async = true
  script.src = url
  document.querySelector('head')!.prepend(script)
}

function formatCode(code: string, language: string) {
  try {
    return window.prettier.format(code, {
      parser: language === 'javascript' ? 'babel' : 'html',
      plugins: window.prettierPlugins,
    })
  }
  catch {
    return code
  }
}

// Load prettier
[
  'standalone.js',
  'plugins/babel.js',
  'plugins/estree.js',
  'plugins/html.js',
].forEach(url => loadScript(`https://unpkg.com/prettier@3.4.2/${url}`))

const sp = new URLSearchParams(location.search)
const reset = sp.has('reset')
const debug = sp.has('debug')

const defaultTemplate
  = (!reset && localStorage.getItem('template'))
    || `{{! This is a comment }}
{{! This is a
comment }}
{{ #comment }}
This is a comment with variable "name='{{= name }}'"
{{ /comment }}
{{ layout "default" }}
{{ include "header" }}
{{ #block body }}
  {{ super }}
  <div>
    <h2>{{= name }}</h2>
    <p>Please visit <a href="{{= url }}">Github Repository</a></p>

    <ul>
      {{ #for name in array | reverse }}
        <li>
          {{ #if name | reverse | lower == "bob" }}
            ***
          {{ else }}
            {{= loop.index + 1 }} - {{= name | reverse | lower }}
          {{ /if }}
        </li>
      {{ /for }}
    </ul>
    ---
    <ul>
      {{ #for a, b in nested }}
        <li>
        {{= a }} - {{= b }}
        </li>
      {{ /for }}
    </ul>
    ---
    <ul>
      {{ #for name in object }}
        <li>
          {{ #if name == "Bob" }}
            ***
          {{ elif name == "Eve" }}
            ---
          {{ elif name | lower == "david" }}
            ...
          {{ else }}
            {{= loop.index }} - {{= name }}
          {{ /if }}
        </li>
      {{ /for }}
    </ul>
    ---
    <ul>
      {{ #for key, name in object }}
        <li>
          {{ #if name == "Bob" }}
            ***
          {{ elif name == "Eve" }}
            ---
          {{ elif name | lower == "david" }}
            ...
          {{ else }}
            {{= loop.index }} {{= key }} - {{= name }}
          {{ /if }}
        </li>
      {{ /for }}
    </ul>
    ---
    <ul>
      {{ #for name in empty }}
        <li>{{= name }}</li>
      {{ else }}
        <li>Empty array</li>
      {{ /for }}
    </ul>
    {{ #with info }}
    <dl>
      <dt>Data Source:</dt>
      <dd>{{= source }}</dd>
      <dt>Version:</dt>
      <dd>{{= version }}</dd>
      <dt>Last Update Time:</dt>
      <dd>{{= lastUpdated }}</dd>
    </dl>
    {{ /with }}
  </div>
{{ /block }}
`

const defaultData
  = (!reset && localStorage.getItem('data')) || `{
  "name": "engine",
  "url": "https://github.com/vvenv/engine",
  "array": [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eve"
  ],
  "nested": [
    [
      "Alice",
      "Eve"
    ],
    [
      "Bob",
      "Charlie"
    ]
  ],
  "object": {
    "A": "Alice",
    "B": "Bob",
    "C": "Charlie",
    "D": "David",
    "E": "Eve"
  },
  "empty": [],
  "info": {
    "source": "Sample Data for Demonstration",
    "version": "1.0",
    "lastUpdated": "2024-10-27"
  }
}
`

const templateEl = document.querySelector<HTMLTextAreaElement>('#template')!
const dataEl = document.querySelector<HTMLTextAreaElement>('#data')!
const codeEl = document.querySelector<HTMLDivElement>('#code')!
const resultEl = document.querySelector<HTMLDivElement>('#result')!
const previewEl = document.querySelector<HTMLDivElement>('#preview')!
const performanceEl = document.querySelector<HTMLDivElement>('#performance')!

async function update() {
  try {
    if (!templateEl.value.trim()) {
      templateEl.value = defaultTemplate
    }

    const template = templateEl.value.trim()
    localStorage.setItem('template', template)

    if (!dataEl.value.trim()) {
      dataEl.value = defaultData
    }

    const data = dataEl.value.trim()
    localStorage.setItem('data', data)

    const parsedData = JSON.parse(data)

    const { Engine } = await import('template')

    const start = performance.now()

    const engine = new Engine({
      debug,
      stripComments: false,
    })

    const initEnd = performance.now()
    const { script, render } = await engine.compile(template)
    const compileEnd = performance.now()
    const result = await render(parsedData)
    const end = performance.now()

    codeEl.innerHTML = await codeToHtml(
      await formatCode(script.toString(), 'javascript'),
      'javascript',
    )

    const initTime = Math.floor((initEnd - start) * 1000) / 1000
    const compileTime = Math.floor((compileEnd - initEnd) * 1000) / 1000
    const renderTime = Math.floor((end - compileEnd) * 1000) / 1000
    const total = Math.floor((end - start) * 1000) / 1000

    performanceEl.textContent = `init     +${initTime}ms
compile  +${compileTime}ms
render   +${renderTime}ms
-----------------
         =${total}ms`

    resultEl.innerHTML = await codeToHtml(
      await formatCode(result, 'html'),
      'html',
    )
    previewEl.innerHTML = result
  }
  catch (error: any) {
    resultEl.innerHTML = ''
    previewEl.innerHTML = `<pre>${new Convert({
      escapeXML: true,
    }).toHtml(error.details || error.message)}</pre>`
  }
}

update()

templateEl.addEventListener('change', update)
dataEl.addEventListener('change', update)
