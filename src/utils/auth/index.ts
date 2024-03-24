import { router } from '@/router'

export function getToken(): string | null {
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo') as string) : {}
  const { token } = userInfo
  return token
}

export function checkAuth(path?: string) {
  const token = getToken()
  if (!token) {
    router.push({
      path: '/login',
      query: {
        redirect: path,
      },
    })
  }
}

export function getUserId(): (number | null) {
  const { path } = router.currentRoute.value
  const regexp = /\/user\/(\d+)/
  const match = path.match(regexp)

  if (match && match[1]) {
    const id = Number.parseInt(match[1], 10)
    return id
  }

  return null
}
