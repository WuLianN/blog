import { type RouteLocationRaw } from 'vue-router'
import { router } from '@/router'

export function useNavigateTo(to: RouteLocationRaw) {
  router.push(to)
}