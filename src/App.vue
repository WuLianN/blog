<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { setupTheme } from '@/hooks/web/useTheme'
import { onMounted, nextTick } from 'vue'

onMounted(() => {
  nextTick(() => {
    setupTheme()
  })
})
</script>


<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
