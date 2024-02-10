import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import { router, setupRouter } from './router/index.ts'
import { setupRouterGuard } from '@/router/guard'
import { setupStore } from '@/store'
import { setupI18n } from '@/locales/setupI18n'
import { setupTheme } from '@/hooks/web/useTheme'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)

async function setup() {
  // 配置 store
  setupStore(app)

  // 多语言配置
  // 异步案例：语言文件可能从服务器端获取
  await setupI18n(app)

  // 配置路由
  setupRouter(app)

  // 路由守卫
  setupRouterGuard(router)

  // 主题
  setupTheme()

  app.use(router).use(ElementPlus)

  app.mount('#app')
}

setup()
