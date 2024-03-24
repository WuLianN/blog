declare module 'element-plus/dist/locale/*' {

}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const vueComponent: DefineComponent<object, object, any>

  export default vueComponent
}
