import { createPermissionGuard } from './permissionGuard'
import type { Router } from 'vue-router'

export function setupRouterGuard(router: Router) {
  createPermissionGuard(router)
}