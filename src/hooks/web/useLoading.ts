import { createApp } from 'vue'
import Loading from '@/components/Loading.vue'

interface LoadingOptions {
  delay?: number // 延迟显示时间(ms)
}

// 私有状态变量，确保模块内唯一
let loadingInstance: any = null
let loadingCount = 0
let loadingTimer: number | null = null

// 单例类
class LoadingManager {
  private static instance: LoadingManager | null = null
  private options: LoadingOptions

  private constructor(options: LoadingOptions = {}) {
    this.options = { delay: 300, ...options }
  }

  // 获取单例实例
  public static getInstance(options?: LoadingOptions): LoadingManager {
    if (!LoadingManager.instance) {
      LoadingManager.instance = new LoadingManager(options)
    }
    return LoadingManager.instance
  }

  // 显示loading
  showLoading = () => {
    if (loadingCount === 0) {
      // 设置延迟显示loading，如果请求很快完成就不显示
      loadingTimer = window.setTimeout(() => {
        // 确保不会重复创建
        if (!loadingInstance) {
          const loadingDiv = document.createElement('div')
          document.body.appendChild(loadingDiv)

          // 创建Loading组件
          loadingInstance = createApp(Loading).mount(loadingDiv)
        }
        loadingTimer = null
      }, this.options.delay)
    }
    loadingCount++
  }

  // 隐藏loading
  hideLoading = () => {
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

  // 获取当前状态（可选）
  getLoadingCount = () => loadingCount
}

// 导出单例实例
export const loadingService = LoadingManager.getInstance()

// 为了兼容现有代码，也导出hook形式
export function useLoading(options: LoadingOptions = {}) {
  // 配置只在首次调用时生效（因为是单例）
  const instance = LoadingManager.getInstance(options)
  return {
    showLoading: instance.showLoading,
    hideLoading: instance.hideLoading,
  }
}
