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

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/user/:id', name: 'user', component: Home },
  { path: '/drafts/:id', name: 'drafts', component: Editor },
  { path: '/draftBox', name: 'draftBox', component: DraftBox },
  { path: '/viewer/:id', name: 'viewer', component: Viewer },
  { path: '/articleManage', name: 'articleManage', component: ArticleManage },
  { path: '/setting', name: 'setting', component: Setting },
  { path: '/upload', name: 'upload', component: Upload },
  { path: '/manageImages', name: 'manageImages', component: ManageImages },
  { path: '/design/login', name: 'loginDesign', component: LoginDesign },
  { path: '/:pathMatch(.*)', component: NotFoundComponent },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export function setupRouter(app: App<Element>) {
  app.use(router)
}
