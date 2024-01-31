import { router } from '@/router'
import type { LocationQueryValue } from 'vue-router'

export function getToken() {
  const token = localStorage.getItem('token')
  return token
}

export function getUserId(): (LocationQueryValue | LocationQueryValue[]) {
  const { path } = router.currentRoute.value
  const regexp = /\/user\/(\d+)/
  const match = path.match(regexp)

  if (match) {
    return match?.[1]
  }

  return null
}