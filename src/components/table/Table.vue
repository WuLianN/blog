<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  width: {
    type: Number,
    default: 600,
  },
  height: {
    type: Number,
    default: 400,
  },
  data: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div>
    <el-table-v2 v-bind="$attrs" :width="width" :height="height" :columns="columns" :data="data">
      <template #empty>
        <!-- 只有在非加载状态下且确实没有数据时才显示空状态 -->
        <Empty v-if="!loading && data && data.length === 0">
          <el-button type="primary" plain @click="$router.back()">
            返回首页
          </el-button>
        </Empty>
        <!-- 加载状态下不显示空状态 -->
        <div v-else-if="loading">
          <!-- 加载占位符，可以留空 -->
        </div>
      </template>
    </el-table-v2>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-tag + .el-tag) {
  margin-left: 10px !important;
}

:deep(.el-scrollbar__thumb) {
  width: 4px !important;
  background-color: var(--el-color-primary-light-8) !important;
  opacity: 1 !important;
}
</style>
