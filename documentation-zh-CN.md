# 使用文档

## 内置标签

### **if / elif / else**：条件判断

```jianjia
{{ #if condition }}内容{{ elif other }}内容{{ else }}内容{{ /if }}
```

### **for / else**：循环遍历

```jianjia
{{ #for item in items }}{{ item }}{{ else }}无数据{{ /for }}
```

### **assign**：变量赋值

```jianjia
{{ assign foo = 123 }}
{{ assign a, b = obj }}
{{ #assign foo }}内容{{ /assign }}
```

### **block / super**：模板继承与区块

```jianjia
{{ #block title }}{{ super }}默认标题{{ /block }}
```

### **macro / caller**：宏定义与调用

```jianjia
{{ #macro my_macro: x, y }}内容{{ caller }}{{ /macro }}
{{ my_macro 1 2 }}
```

### **call**：调用宏

```jianjia
{{ #call my_macro "foo" "bar" }}内容{{ /call }}
```

### **break / continue**：循环控制

```jianjia
{{ break }}
{{ continue }}
```

### **with**：上下文变量赋值

```jianjia
{{ #with obj }}
{{= key }}
{{ /with }}
```

### **comment**：注释

```jianjia
{{! 这是注释 }}
{{ #comment }}多行注释{{ /comment }}
```

### **raw**：原文输出（不解析内容）

```jianjia
{{ #raw }}{{ #if x }}foo{{ /if }}{{ /raw }}
```

### **expression（=）**：表达式输出

```jianjia
{{= foo | upper }}
{{= a if cond else b }}
```

## 内置过滤器

abs, capitalize, add, date, entries, even, fallback, first, groupby, join, json, keys, last, length, lower, map, max, min, minus, odd, omit, pick, repeat, replace, reverse, safe, slice, sort, split, sum, t, time, trim, unique, upper, values

### 示例

```jianjia
{{= foo | upper }}
{{= list | join: "," }}
{{= obj | keys }}
{{= arr | groupby: key_name }}
```

## 自定义

### 自定义标签

```javascript
const myTag = {
  names: ['my_tag'],
  parse({ ast, base }) {
    // 解析逻辑
    ast.start({ ...base, name: 'my_tag' })
    ast.end({ ...base, startIndex: base.endIndex, name: 'end_my_tag' })
  },
  async compile({ template, tag, context, out }, compileContent) {
    // 编译逻辑
    out.pushStr('自定义标签内容')
  }
}
const engine = new Engine()
engine.registerTags([myTag])
```

模板中即可使用

```jianjia
{{ my_tag }}
```

### 自定义过滤器

```javascript
const engine = new Engine()
engine.registerFilters({
  my_filter(value) {
    return `自定义：${value}`
  }
})
```

模板中即可使用

```jianjia
{{= foo | my_filter }}
```

---

如需更多细节，可参考源码 `packages/template/src/filters.ts` 和 `packages/template/src/tags/` 目录实现。
