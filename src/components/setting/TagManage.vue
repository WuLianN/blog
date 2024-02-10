<template>
  <div class="tag">
    <Tags :tags="list" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getTagList } from '@/api/tags'

const list = ref([])

getList()

async function getList() {
  const result = await getTagList()
  list.value.push(...result)
}
</script>

<style scoped lang="scss">
.tag {
  width: 100%;
}
</style>