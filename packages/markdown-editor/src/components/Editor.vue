<script setup lang="ts">
import gfm from '@bytemd/plugin-gfm'
import frontmatter from '@bytemd/plugin-frontmatter'
import gemoji from '@bytemd/plugin-gemoji'
import highlight from '@bytemd/plugin-highlight'
import math from '@bytemd/plugin-math'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import mermaid from '@bytemd/plugin-mermaid'
import breaks from '@bytemd/plugin-breaks'
import highlightTheme from '@ziuchen/bytemd-plugin-highlight-theme'
import imageZoom from '@ziuchen/bytemd-plugin-image-zoom'
import align from '@ziuchen/bytemd-plugin-align'
import hls from '@ziuchen/bytemd-plugin-highlight-theme/dist/highlights.json'
import 'bytemd/dist/index.css'
import zh_Hans_highlight_theme from '@ziuchen/bytemd-plugin-highlight-theme/locales/zh_Hans.json'
import zh_Hans_image_zoom from '@ziuchen/bytemd-plugin-image-zoom/locales/zh_Hans.json'
import zh_Hans_algin from '@ziuchen/bytemd-plugin-align/locales/zh_Hans.json'
import theme from '../plugins/theme.ts'
import exportMD from '../plugins/exportMD.ts'
import importMD from '../plugins/importMD.ts'
import Dialog from './Dialog.vue'

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  upload: {
    type: Function,
    default: () => { },
  },
})

const emits = defineEmits(['contentChange'])

function stripPrefixes(obj: Record<string, any>) {
  return Object.entries(obj).reduce((p, [key, value]) => {
    p[key.split('/').slice(-1)[0].replace('.json', '')] = value
    // console.log(p)
    return p
  }, {} as Record<string, any>)
}

const locales = stripPrefixes(
  import.meta.glob('../../node_modules/bytemd/locales/*.json', { eager: true }),
)
const gfmLocales = stripPrefixes(
  import.meta.glob('../../node_modules/@bytemd/plugin-gfm/locales/*.json', {
    eager: true,
  }),
)
const mathLocales = stripPrefixes(
  import.meta.glob('../../node_modules/@bytemd/plugin-math/locales/*.json', {
    eager: true,
  }),
)
const mermaidLocales = stripPrefixes(
  import.meta.glob('../../node_modules/@bytemd/plugin-mermaid/locales/*.json', {
    eager: true,
  }),
)

const localeKey = 'zh_Hans'
const locale = locales[localeKey]

const plugins = [
  breaks(),
  gfm({
    locale: gfmLocales[localeKey],
  }),
  frontmatter(),
  gemoji(),
  highlight(),
  math({
    locale: mathLocales[localeKey],
  }),
  mediumZoom(),
  align({
    locale: zh_Hans_algin,
  }),
  imageZoom({
    locale: zh_Hans_image_zoom,
  }),
  mermaid({
    locale: mermaidLocales[localeKey],
  }),
  theme(),
  highlightTheme({
    highlights: hls,
    locale: zh_Hans_highlight_theme,
  }),
  exportMD(),
  importMD(),
]

function handleChange(v: any) {
  emits('contentChange', v)
}

function uploadImages(fileList: Array<File>) {
  return Promise.all(fileList.map((file) => {
    return props.upload(file)
  }))
}

async function fileChange(file: File) {
  const fileReader = new FileReader()
  fileReader.readAsText(file)

  fileReader.addEventListener('load', () => {
    emits('contentChange', fileReader.result as string)
  })
}
</script>

<template>
  <Editor :value="content" :plugins="plugins" :locale="locale" :upload-images="uploadImages" @change="handleChange" />
  <Dialog @file-change="fileChange" />
</template>

<style scoped lang="scss">
$header-height: 64px;

:deep(.bytemd) {
  height: calc(100vh - $header-height) !important;
}
</style>
