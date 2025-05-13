<script setup>
import { ref } from 'vue'
import JsonEditorVue from 'json-editor-vue'

const value = ref('')
</script>

<template>
  <JsonEditorVue v-model="value" v-bind="$attrs" />
</template>
