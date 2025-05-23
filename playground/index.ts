import { Engine } from '../packages/template/src';

declare global {
  interface Window {
    js_beautify: any;
    html_beautify: any;
    hljs: any;
  }
}

const sp = new URLSearchParams(location.search);
const reset = sp.has('reset');
const raw = sp.has('raw');

const defaultTemplate =
  (!reset && localStorage.getItem('template')) ||
  `{{ ! This is a comment }}
{{ # This is a
comment # }}
{{ #comment }}
This is a comment with variable {{ name }}
{{ /comment }}
{{ layout "default" }}
{{ include "header" }}
{{ #block body }}
  {{ super() }}
  <div>
    <h2>{{ name }}</h2>
    <p>Please visit <a href="{{ url }}">Github Repository</a></p>

    <ul>
      {{ #for name in array | reverse }}
        <li>
          {{ #if name | reverse | lower == "bob" }}
            ***
          {{ else }}
            {{ loop.index + 1 }} - {{ name | reverse | lower }}
          {{ /if }}
        </li>
      {{ /for }}
    </ul>
    ---
    <ul>
      {{ #for a, b in nested }}
        <li>
        {{ a }} - {{ b }}
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
            {{ loop.index }} - {{ name }}
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
            {{ loop.index }} {{ key }} - {{ name }}
          {{ /if }}
        </li>
      {{ /for }}
    </ul>
    ---
    <ul>
      {{ #for name in empty }}
        <li>{{ name }}</li>
      {{ else }}
        <li>Empty array</li>
      {{ /for }}
    </ul>
    <dl>
      <dt>Data Source:</dt>
      <dd>{{ info.source }}</dd>
      <dt>Version:</dt>
      <dd>{{ info.version }}</dd>
      <dt>Last Update Time:</dt>
      <dd>{{ info.lastUpdated }}</dd>
    </dl>
  </div>
{{ /block }}
`;

const defaultData =
  (!reset && localStorage.getItem('data')) ||
  `{
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
`;

const templateEl = document.querySelector<HTMLTextAreaElement>('#template')!;
const dataEl = document.querySelector<HTMLTextAreaElement>('#data')!;
const codeEl = document.querySelector<HTMLElement>('#code > code')!;
const resultEl = document.querySelector<HTMLElement>('#result > code')!;
const previewEl = document.querySelector<HTMLDivElement>('#preview')!;
const performanceEl = document.querySelector<HTMLDivElement>('#performance')!;

async function update() {
  try {
    if (!templateEl.value.trim()) {
      templateEl.value = defaultTemplate;
    }

    const template = templateEl.value.trim();
    localStorage.setItem('template', template);

    if (!dataEl.value.trim()) {
      dataEl.value = defaultData;
    }

    const data = dataEl.value.trim();
    localStorage.setItem('data', data);

    const parsedData = JSON.parse(data);

    const now = performance.now();

    const engine = new Engine({
      debug: true,
      stripComments: false,
    });

    const { script, render } = await engine.compile(template);
    const now1 = performance.now();
    const result = await render(parsedData);
    const now2 = performance.now();

    codeEl.textContent = raw
      ? script.toString()
      : window.js_beautify(script.toString(), {
          indent_size: 2,
        });

    const time1 = Math.floor((now1 - now) * 1000) / 1000;
    const time2 = Math.floor((now2 - now1) * 1000) / 1000;
    performanceEl.textContent = `${time1}ms + ${time2}ms ==> ${time1 + time2}ms`;

    resultEl.textContent = raw
      ? result
      : window.html_beautify(result, {
          indent_size: 2,
        });
    previewEl.innerHTML = result;
  } catch (error: any) {
    console.error(error);
    console.log(error.details);
  }

  delete codeEl.dataset.highlighted;
  delete resultEl.dataset.highlighted;
  window.hljs.highlightAll();
}

update();

templateEl.addEventListener('change', update);
dataEl.addEventListener('change', update);
codeEl.addEventListener('focus', (e) => {
  (e.currentTarget as HTMLTextAreaElement).select();
});
resultEl.addEventListener('focus', (e) => {
  (e.currentTarget as HTMLTextAreaElement).select();
});
