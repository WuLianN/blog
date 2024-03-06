<template>
  <div class="tag">
    <Tags :tags="list" :editable="true" @update="updateItem" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getTagList } from '@/api/tags'

const list = ref<any[]>([])

getList()

async function getList() {
  const result: any[] = await getTagList()
  list.value.push(...result)
}

async function updateItem(tagInfo: any) {
  if (tagInfo.id) {
    list.value.map(item => {
      if (item.id === tagInfo.id) {
        item.name = tagInfo.name
        item.color = tagInfo.color
        item.bg_color = tagInfo.bg_color
      }
    })
  }
}
</script>

<style scoped lang="scss">
.tag {
  width: 100%;
}

:deep(.el-tag) {
  border-color: transparent !important;
}
</style>