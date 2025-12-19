# useLoading Hook 使用指南

## 介绍

`useLoading` 是一个用于管理全局或局部 Loading 状态的自定义 Hook。它支持延迟显示等功能，可以有效提升用户体验。

## 安装和使用

```typescript
import { useLoading } from '@/hooks/web/useLoading'
```

## 基本用法

### 1. 在 Axios 请求中使用（默认配置）

当前项目已经在 Axios 中集成了 useLoading，无需额外配置即可使用智能 Loading 功能。

### 2. 在路由跳转中使用

```typescript
import { useLoading } from '@/hooks/web/useLoading'
import { useRouter } from 'vue-router'

export default function useRouteWithLoading() {
  const router = useRouter()
  const { showLoading, hideLoading } = useLoading({ delay: 300 })

  const navigateTo = async (path: string) => {
    showLoading()
    try {
      // 模拟路由跳转前的数据加载
      await someAsyncOperation()
      router.push(path)
    } finally {
      hideLoading()
    }
  }

  return {
    navigateTo
  }
}
```

### 3. 在组件中手动控制 Loading

```vue
<template>
  <div>
    <button @click="handleAction">执行操作</button>
  </div>
</template>

<script setup lang="ts">
import { useLoading } from '@/hooks/web/useLoading'

const { showLoading, hideLoading } = useLoading({
  delay: 500 // 500ms 内完成的操作不显示 loading
})

const handleAction = async () => {
  showLoading()
  try {
    // 执行异步操作
    await someAsyncFunction()
  } finally {
    hideLoading()
  }
}
</script>
```

## API

### Options

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| delay | 延迟显示时间(ms)，在这个时间内完成的操作不显示loading | number | 300 |

### Returns

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| showLoading | 显示loading的方法 | () => void |
| hideLoading | 隐藏loading的方法 | () => void |

## 特性

1. **智能延迟显示**：对于快速完成的操作（默认300ms内），不显示loading，避免界面闪烁
2. **并发请求支持**：内部使用计数器管理多个并发请求，确保所有请求完成后再隐藏loading
3. **全局单例**：在Axios中使用的是全局单例，确保loading状态统一管理
4. **可访问性支持**：包含适当的ARIA属性，支持屏幕阅读器

## 注意事项

1. 每次调用 `showLoading()` 必须对应一次 `hideLoading()` 调用
2. 在异步操作中建议使用 `try/finally` 语句确保 `hideLoading()` 被执行
3. 可以多次调用 `useLoading()` 创建不同的loading实例，互不影响