/**
 * Configure and register global directives
 */
import type { App } from 'vue'
import { setupPermissionDirective } from './permission'
import { setupBrowseModeDirective } from './browseMode'

export function setupGlobDirectives(app: App) {
  setupPermissionDirective(app)
  setupBrowseModeDirective(app)
}
