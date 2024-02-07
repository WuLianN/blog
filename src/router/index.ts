import { createRouter, createWebHistory } from 'vue-router'
import { type App } from 'vue'

const Login = () => import("@/views/Login.vue")
const Home = () => import("@/views/Home.vue")
const CreateCenter = () => import("@/views/CreateCenter.vue")
const Editor = () => import("@/views/Editor.vue")
const DraftBox = () => import("@/views/DraftBox.vue")
const Viewer = () => import('@/views/Viewer.vue')
const MenuManage = () => import('@/views/MenuManage.vue')
const TagManage = () => import('@/views/TagManage.vue')
const ArticleManage = () => import('@/views/ArticleManage.vue')

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: "login", component: Login },
  { path: '/user/:id', name: 'user', component: Home },
  { path: '/createCenter', name: 'createCenter', component: CreateCenter },
  { path: '/drafts/:id', name: 'drafts', component: Editor },
  { path: '/draftBox', name: 'draftBox', component: DraftBox },
  { path: '/viewer/:id', name: 'viewer', component: Viewer },
  { path: '/menuManage', name: 'menuManage', component: MenuManage },
  { path: '/tagManage', name: 'tagManage', component: TagManage },
  { path: '/articleManage', name: 'articleManage', component: ArticleManage }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export function setupRouter(app: App<Element>) {
  app.use(router)
}