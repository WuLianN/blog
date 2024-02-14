<template>
  <el-color-picker v-model="color" @activeChange="activeChange" show-alpha />
</template>

<script setup lang="ts">
import { useCssVar } from '@vueuse/core'
import { useTheme } from '@/hooks/web/useTheme'

const primaryVarName = '--el-color-primary' // css变量名
const primaryLocalName = 'primaryColor' // localstorage 变量名
const color = useCssVar(primaryVarName)

function activeChange(value: any) {
  useTheme(primaryVarName, primaryLocalName, value)
}
</script>

<style scoped lang="scss"></style>