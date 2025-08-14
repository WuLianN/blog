import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import { setupRouter } from './router/index.ts'
import { setupStore } from '@/store'
import { setupGlobDirectives } from '@/directvies'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)

async function setup() {
  // 配置 store
  setupStore(app)

  // 配置路由
  setupRouter(app)

  // 全局指令
  setupGlobDirectives(app)

  app.use(ElementPlus, {
    locale: zhCn,
  })

  app.mount('#app')
}

setup()
