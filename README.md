## 博客
前后端分离，简易动态博客。前端使用Vue3 + ts + Vite构建，使用[bytemd](https://github.com/bytedance/bytemd)markdown编辑器、[掘金markdown主题](https://github.com/xitu/juejin-markdown-themes)。

## 功能
- [x] 自定义__菜单(分类)
- [x] 自定义__标签
- [x] 自定义__主题
- [x] 暗黑模式
- [x] 关联账号


## 后端项目
* [go-toy](https://github.com/WuLianN/go-toy)


## 使用 gray-matter 的注意点

> ReferenceError: Buffer is not defined
>
> https://github.com/jonschlinkert/gray-matter/issues/143

### 解决方案
`vite.config.js` 使用 `vite-plugin-node-polyfills`
```js
plugins: [
  nodePolyfills(
    {
      globals: {
        Buffer: true, // can also be 'build', 'dev', or false
      },
    }
  )  
]
```