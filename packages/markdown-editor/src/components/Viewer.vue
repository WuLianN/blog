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
import { Viewer } from '@bytemd/vue-next'
import theme from '../plugins/theme.ts'

defineProps({
  content: {
    type: String,
    default: '',
  },
})

function stripPrefixes(obj: Record<string, any>) {
  return Object.entries(obj).reduce((p, [key, value]) => {
    p[key.split('/').slice(-1)[0].replace('.json', '')] = value
    return p
  }, {} as Record<string, any>)
}

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
]
</script>

<template>
  <Viewer :value="content" :plugins="plugins" />
</template>

<style scoped lang="scss"></style>
