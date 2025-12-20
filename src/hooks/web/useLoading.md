# useLoading Hook 使用指南

在现代前端应用中，良好的用户体验至关重要。当应用执行异步操作时，向用户提供清晰的加载状态反馈能够显著提升产品的专业性和易用性。本文将介绍一个实用的 useLoading Hook，它可以帮助你在各种场景下轻松管理加载状态。

## 介绍

`useLoading` 是一个用于管理全局或局部 Loading 状态的自定义 Hook。它支持延迟显示等功能，可以有效提升用户体验。通过智能的延迟机制和并发请求管理，这个 Hook 能够避免界面闪烁，并确保在多个并发请求场景下的正确行为。

## 安装和使用

```typescript
import { useLoading } from "@/hooks/useLoading";
```

## 基本用法

### 1. 在 Axios 请求中使用

最常见的用法是在 HTTP 请求中使用 `useLoading`，通常我们会将其集成到 axios 拦截器中：

```js
// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么

    // 显示加载（除非明确设置了 isLoading: false）
    if (config.isLoading !== false) {
      showLoading();
    }

    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么

    // 隐藏加载
    hideLoading();

    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么

    // 隐藏加载
    hideLoading();

    return Promise.reject(error);
  }
);
```

在这个例子中，我们利用了 `useLoading` 的智能特性，可以针对特定请求禁用加载状态，只需在请求配置中添加 `isLoading: false`。

### 2. 在路由跳转中使用

在页面导航期间，特别是加载较重的页面时，显示加载指示器可以改善用户体验：

```js
import { createRouter, createWebHistory } from "vue-router";
import { useLoading } from "@/hooks/useLoading";
import DraftBox from "@/views/DraftBox.vue";

const { showLoading, hideLoading } = useLoading({ delay: 300 });

const routes = [
  {
    path: "/draftBox",
    name: "draftBox",
    component: DraftBox,
    meta: {
      title: "草稿箱",
      isLoading: true,
    },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// beforeEach 钩子，在路由跳转之前显示loading
router.beforeEach((to, _from, next) => {
  if (to.meta.isLoading) {
    showLoading();
  }
  next();
});

// afterEach 钩子，在路由跳转完成后隐藏loading
router.afterEach((to, _from) => {
  if (to.meta.isLoading) {
    hideLoading();
  }
});

// 错误处理，确保在路由出错时也能正确隐藏loading
router.onError((error) => {
  hideLoading();
  console.error("路由错误:", error);
});
```

通过这种方式，我们可以在路由切换时自动显示加载状态，确保用户知道页面正在加载。

### 3. 在组件中手动控制 Loading

有时我们需要在特定的用户操作中显示加载状态：

```html
<script setup lang="ts">
  import { useLoading } from "@/hooks/useLoading";

  const { showLoading, hideLoading } = useLoading({
    delay: 500, // 500ms 内完成的操作不显示 loading
  });

  async function handleAction() {
    showLoading();
    try {
      // 执行异步操作
      await someAsyncFunction();
    } finally {
      // 确保总是隐藏加载状态
      hideLoading();
    }
  }
</script>

<template>
  <div>
    <button @click="handleAction">执行操作</button>
  </div>
</template>
```

在这种情况下，我们使用 `try/finally` 语句确保无论操作成功与否，加载状态都会被正确隐藏。

## API

### Options

| 参数  | 说明                                                   | 类型   | 默认值 |
| ----- | ------------------------------------------------------ | ------ | ------ |
| delay | 延迟显示时间(ms)，在这个时间内完成的操作不显示 loading | number | 300    |

### Returns

| 参数        | 说明                | 类型       |
| ----------- | ------------------- | ---------- |
| showLoading | 显示 loading 的方法 | () => void |
| hideLoading | 隐藏 loading 的方法 | () => void |

## 特性

1. **智能延迟显示**：对于快速完成的操作（默认 300ms 内），不显示 loading，避免界面闪烁
2. **并发请求支持**：内部使用计数器管理多个并发请求，确保所有请求完成后再隐藏 loading
3. **全局单例**：确保 loading 状态统一管理
4. **可访问性支持**：包含适当的 ARIA 属性，支持屏幕阅读器
