<script setup lang="ts">
defineProps({
  width: {
    type: Number,
    default: 600,
  },
  height: {
    type: Number,
    default: 400,
  },
})
</script>

<template>
  <div>
    <el-table-v2 v-bind="$attrs" :width="width" :height="height">
      <template #empty>
        <Empty>
          <el-button type="primary" plain @click="$router.back()">
            返回首页
          </el-button>
        </Empty>
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
