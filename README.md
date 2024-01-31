## 博客

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