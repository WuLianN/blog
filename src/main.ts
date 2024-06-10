import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router/index.ts'
// import { setupRouterGuard } from '@/router/guard'
import { setupStore } from '@/store'
import { setupGlobDirectives } from '@/directvies'

const app = createApp(App)

async function setup() {
  // 配置 store
  setupStore(app)

  // 配置路由
  setupRouter(app)

  // 路由守卫
  // setupRouterGuard(router)

  // 全局指令
  setupGlobDirectives(app)

  app.mount('#app')
}

setup()
