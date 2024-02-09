<template>
  <div>
    <el-table-v2 :columns="columns" :data="data" :width="width" :height="height" fixed @end-reached="endReached" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    default: () => []
  },
  width: {
    type: Number,
    default: 600
  },
  height: {
    type: Number,
    default: 400
  }
})

const emit = defineEmits(["endReached"])

function endReached() {
  emit("endReached")
}
</script>

<style scoped lang="scss">
:deep(.el-tag + .el-tag) {
  margin-left: 10px !important;
}
</style>