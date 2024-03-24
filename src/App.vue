<script lang="ts" setup>
import { nextTick, onMounted } from 'vue'
import { setupTheme } from '@/hooks/web/useTheme'

onMounted(() => {
  nextTick(() => {
    setupTheme()
  })
})
</script>

<template>
  <router-view />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
