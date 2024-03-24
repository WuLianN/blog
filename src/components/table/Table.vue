<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  width: {
    type: Number,
    default: 600,
  },
  height: {
    type: Number,
    default: 400,
  },
})

const emit = defineEmits(['endReached'])

function endReached() {
  emit('endReached')
}
</script>

<template>
  <div>
    <el-table-v2 :columns="columns" :data="data" :width="width" :height="height" fixed @end-reached="endReached" />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-tag + .el-tag) {
  margin-left: 10px !important;
}
</style>
