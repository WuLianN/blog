import { createApp } from 'vue'
import Loading from '@/components/Loading.vue'

interface LoadingOptions {
  delay?: number // 延迟显示时间(ms)
}

let loadingInstance: any = null
let loadingCount = 0
let loadingTimer: number | null = null

/**
 * 智能Loading Hook
 * @param options 配置选项
 */
export function useLoading(options: LoadingOptions = {}) {
  const { delay = 300 } = options

  // 显示loading
  const showLoading = () => {
    if (loadingCount === 0) {
      // 设置延迟显示loading，如果请求很快完成就不显示
      loadingTimer = window.setTimeout(() => {
        const loadingDiv = document.createElement('div')
        document.body.appendChild(loadingDiv)

        // 创建Loading组件
        loadingInstance = createApp(Loading).mount(loadingDiv)
        loadingTimer = null
      }, delay)
    }
    loadingCount++
  }

  // 隐藏loading
  const hideLoading = () => {
    loadingCount--
    if (loadingCount <= 0) {
      loadingCount = 0
      // 如果还没显示loading就取消定时器
      if (loadingTimer) {
        clearTimeout(loadingTimer)
        loadingTimer = null
      }
      // 如果已经显示了loading则隐藏它
      if (loadingInstance) {
        // 通过获取挂载点元素并移除来销毁实例
        const el = loadingInstance.$el || loadingInstance.parentNode
        el && el.parentNode && el.parentNode.removeChild(el)
        loadingInstance = null
      }
    }
  }

  return {
    showLoading,
    hideLoading,
  }
}
