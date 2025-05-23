# JianJia

<p align="center">A simple, fast, lightweight, and extensible template engine for Node.js and browsers.</p>

<p align="center">
  <a href="https://github.com/vvenv/jianjia/actions/workflows/test.yml"><img src="https://github.com/vvenv/jianjia/actions/workflows/test.yml/badge.svg" alt="test"></a>
</p>

<p align="center">
  <a href="./README-zh-CN.md">中文</a>
</p>

## Key Features

- 📝 **Intuitive Template Syntax**: Simple syntax for variables, conditionals, and loops.
- 🔗 **Custom global variables**: Supports definition of global variables.
- 🛠️ **Built-in Tags and Filters**: A collection of built-in tags and filters.
- 🎨 **Custom Tags and Filters**: Ability to define custom tags and filters.
- 🚀 **Pre-compilation**: Enhance rendering performance by precompiling.
- 🐛 **Error Handling and Debugging**: Provides detailed error reporting and debugging support.
- 🛡️ **Security**: Sandbox mode, and automatic escaping.
- 🛫 **Asynchronous Data Loading**: Supports fetching and displaying remote data asynchronously.

## Getting Started

```javascript
const engine = new Engine()
const { render } = await engine.compile('Hello, {{= name }}！')
const html = await render({ name: 'World' })
document.body.innerHTML = html
```

Or, in a simpler way:

```javascript
document.body.innerHTML = await template('Hello, {{= name }}!', {
  name: 'World',
})
```

[Documentation](./documentation.md)

## License

`JianJia` is released under the [MIT License](https://opensource.org/licenses/MIT). You are free to use, modify, and distribute it as long as you comply with the license terms.
