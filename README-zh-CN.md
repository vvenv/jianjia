# 蒹葭

<p align="center">一个简单、快速且轻量的 Node.js 和浏览器模板引擎。</p>

<p align="center">
<a href="https://github.com/vvenv/jianjia/actions/workflows/test.yml"><img src="https://github.com/vvenv/jianjia/actions/workflows/test.yml/badge.svg" alt="test"></a>
</p>

<p align="center">
  <a href="./README.md">English Documentation</a>
</p>

## 主要特点

- 📝 **直观的模板语法**：易于理解的模板语法，用于定义变量、条件和循环。
- 🔗 **自定义全局变量**：支持定义全局变量。
- 🛠️ **内置标签和过滤器**：一组内置函数和过滤器。
- 🎨 **自定义标签和过滤器**：能够定义自定义函数和过滤器。
- 🚀 **预编译**：通过预编译模板来增强渲染性能。
- 🐛 **错误处理和调试**：提供详细的错误报告和调试支持。
- 🛡️ **安全性**：沙盒模式，自动转义以防止 XSS 和其他安全漏洞。
- 🛫 **异步数据加载**：支持异步获取和显示远程数据。

## 快速开始

```javascript
const engine = new Engine();
const { render } = await engine.compile('{{ name }} 苍苍，白露为霜');
const html = await render({ name: '蒹葭' });
document.body.innerHTML = html;
```

或，更简单的方式：

```javascript
document.body.innerHTML = await template('{{ name }} 苍苍，白露为霜', {
  name: '蒹葭',
});
```

## 许可证

`JianJia` 在 [MIT 许可证](https://opensource.org/licenses/MIT) 下发布。你可以自由使用、修改和分发它，只要你遵守许可证条款。
