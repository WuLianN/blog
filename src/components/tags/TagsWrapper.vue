<template>
  <div class="tags-container">
    <Tags :tags="tags" :isPost="isPost" :dialogVisible="dialogVisible" @selectedTags="selectedTags" />
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps({
  tags: {
    type: Array,
    default: () => []
  },
  dialogVisible: {
    type: Boolean,
    default: false
  },
  isPost: {
    type: Boolean,
    default: false
  },
  // 原始标签数据
  originTags: {
    type: Array,
    default: () => []
  }
})

const { originTags } = toRefs(props)

const emits = defineEmits(['change'])

const selectedTags = (data) => {
  const selectedIds = data.reduce((acc, cur) => {
    if (cur.id) {
      acc.push(cur.id)
    }
    return acc
  }, [])
  const oldSelectedTags = originTags.value.filter(item => !selectedIds.includes(item.id))
  const newSelectedTags = data.filter(item => item.id === undefined)

  const tagsInfo = {
    oldSelectedTags: oldSelectedTags, // 旧标签 -> 解绑
    newSelectedTags: newSelectedTags // 新标签 -> 绑定
  }

  emits('change', tagsInfo)
}
</script>

<style scoped lang="scss">
.tags-container {
  margin-top: 20px;
}

.button-tag,
.el-input {
  margin-left: 0 !important;
}

.el-tag+.button-tag,
.el-tag+.el-input {
  margin-left: 10px !important;
}
</style>