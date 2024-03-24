import type { RouteLocationRaw } from 'vue-router'
import { router } from '@/router'

export function useNavigateTo(to: RouteLocationRaw) {
  router.push(to)
}

export function useNavigateToNewTag(to: RouteLocationRaw) {
  const route = router.resolve(to)
  window.open(route.href, '_blank')
}

export function useNavigateReplace(to: RouteLocationRaw) {
  router.replace(to)
}
