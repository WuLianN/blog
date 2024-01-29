/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from 'vue'

  const vueComponent: DefineComponent<{}, {}, any>

  export default vueComponent
}

declare module 'lodash-es'

declare module '@/plugins/exportMD.ts'
declare module '@/plugins/importMD.ts'
declare module '@/examples/index.js'
declare module '@bytemd/vue-next'
declare module '@/utils/index.ts'
declare module '@/plugins/theme.ts'