import { createRouter, createWebHistory } from 'vue-router'
import { type App } from 'vue'

const Login = () => import("@/views/Login.vue")
const Home = () => import("@/views/Home.vue")
const CreateCenter = () => import("@/views/CreateCenter.vue")

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: "login", component: Login },
  { path: '/createCenter', name:'createCenter', conponent: CreateCenter }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export function setupRouter(app: App<Element>) {
  app.use(router)
}