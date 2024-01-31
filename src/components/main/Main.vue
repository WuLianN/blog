<template>
  <div class="main">
    <Card :list="recommendList" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getRecommendList } from '@/api/base'
import { getUserId } from '@/utils/auth'

import matter from 'gray-matter';

const userId = getUserId()
const recommendList = ref([])

const query = ref(
  {
    userId: userId,
    page: 1,
    pageSize: 10
  }
)

getList() 

async function getList() {
  const list = await getRecommendList(query.value)

  list.map(item => item.excerpt = getExcerpt(item.content))

  recommendList.value.push(...list)
}

function getExcerpt(value: string): string {
  const summaryLength = 200
  const { content } = matter(value);
  const sanitizedContent = content.trim().replaceAll(/#+\s+(.+)/g, '')
  const excerpt = sanitizedContent.trim().slice(0, summaryLength) + ' ...'

  return excerpt
}

</script>

<style scoped lang="scss">
.main {
  width: 700px;
}
</style>