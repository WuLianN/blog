<script setup lang="ts">
import { ref } from 'vue'
import JsonEditor from './components/JsonEditor.vue'

const content = ref('')
const config = {
  mode: 'text',
}
</script>

<template>
  <div class="editor-wrapper">
    <JsonEditor v-model="content" class="editor" v-bind="config" />
  </div>
</template>

<style scoped lang="scss">
.editor-wrapper {
  width: 100%;
  height: 100vh;

  .editor {
    width: 100%;
    height: 100%;
  }
}
</style>
