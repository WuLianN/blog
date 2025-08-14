import { createRouter, createWebHistory } from 'vue-router'
import type { App } from 'vue'

const Login = () => import('@/views/Login.vue')
const Home = () => import('@/views/Home.vue')
const Editor = () => import('@/views/Editor.vue')
const DraftBox = () => import('@/views/DraftBox.vue')
const Viewer = () => import('@/views/Viewer.vue')
const ArticleManage = () => import('@/views/ArticleManage.vue')
const Setting = () => import('@/views/Setting.vue')
const Upload = () => import('@/views/Upload.vue')
const ManageImages = () => import('@/views/ManageImages.vue')
const NotFoundComponent = () => import('@/views/NotFound.vue')
const LoginDesign = () => import('@/views/design/Login.vue')
const Toolkit = () => import('@/views/toolkit/index.vue')
const JsonEditor = () => import('@/views/toolkit/JsonEditor.vue')

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/user/:id', name: 'user', component: Home },
  { path: '/drafts/:id', name: 'drafts', component: Editor },
  { path: '/draftBox', name: 'draftBox', component: DraftBox, meta: { title: '草稿箱' } },
  { path: '/viewer/:id', name: 'viewer', component: Viewer },
  { path: '/articleManage', name: 'articleManage', component: ArticleManage, meta: { title: '文章管理' } },
  { path: '/setting', name: 'setting', component: Setting, meta: { title: '设置' } },
  { path: '/upload', name: 'upload', component: Upload },
  { path: '/manageImages', name: 'manageImages', component: ManageImages },
  { path: '/design/login', name: 'loginDesign', component: LoginDesign },
  { path: '/toolkit', name: 'toolkit', component: Toolkit, meta: { title: '工具箱' } },
  { path: '/toolkit/json-editor', name: 'JsonEditor', component: JsonEditor, meta: { title: 'JSON 编辑器' } },
  { path: '/:pathMatch(.*)', component: NotFoundComponent },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  else {
    document.title = 'blog'
  }
  next()
})

export function setupRouter(app: App<Element>) {
  app.use(router)
}
