<script setup lang="ts">
import type { PropType } from 'vue'
import { toRefs } from 'vue'

const props = defineProps({
  // 原始标签数据
  originTags: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
})

const emits = defineEmits(['change'])

const { originTags } = toRefs(props)

function selectedTags(data: any[]) {
  const selectedIds = data.reduce((acc, cur) => {
    if (cur.id)
      acc.push(cur.id)

    return acc
  }, [])
  const oldSelectedTags = originTags.value.filter(item => !selectedIds.includes(item.id))
  const newSelectedTags = data.filter(item => item.id === undefined)

  const tagsInfo = {
    oldSelectedTags, // 旧标签 -> 解绑
    newSelectedTags, // 新标签 -> 绑定
  }

  emits('change', tagsInfo)
}
</script>

<template>
  <div class="tags-container">
    <Tags v-bind="$attrs" @selected-tags="selectedTags" />
  </div>
</template>

<style scoped lang="scss">
.tags-container {
  margin-top: 20px;
}
</style>
