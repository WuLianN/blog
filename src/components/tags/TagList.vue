<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  list: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
})

defineEmits(['click'])
</script>

<template>
  <div>
    <el-tag
      v-for="tag in list" :key="tag.id" size="large"
      :style="{ backgroundColor: tag.bg_color, color: tag.color }" @click.stop="$emit('click', tag)"
    >
      {{ tag.name }}
    </el-tag>
  </div>
</template>

<style scoped lang="scss">
$Margin: 10px;

:deep(.el-tag) {
  margin-bottom: $Margin;
  margin-right: $Margin;
  cursor: pointer;
}
</style>
