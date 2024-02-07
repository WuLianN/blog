<template>
  <Card :list="recommendList" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getRecommendList } from '@/api/base'
import { getUserId } from '@/utils/auth'
import { useHomeStore } from '@/store/modules/home'
import { getExcerpt } from '@/utils/three_party'

const userId = getUserId()
const recommendList = ref([])
const homeStore = useHomeStore()  

const query = ref(
  {
    userId: userId,
    page: 1,
    pageSize: 10
  }
)

getList() 

// 侦听store中的推荐列表 tip: 切换分类会更新store中的推荐列表
watch(() => homeStore.recommendList, (value) => {
  recommendList.value = value
})

async function getList() {
  const list = await getRecommendList(query.value)

  list.map(item => item.excerpt = getExcerpt(item.content))

  recommendList.value.push(...list)
}

</script>

<style scoped lang="scss">

</style>