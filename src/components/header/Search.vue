<template>
  <el-input v-model="query.keyword" placeholder="搜索文章标题" @change="search" :suffix-icon="Search" />
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { searchDrafts } from '@/api/drafts'
import { RecommendDraft } from '@/api/model/draftsModel'
import { useHomeStore } from '@/store/modules/home'
import { buildRecommendList } from '@/utils/blog'
import { getUserId } from '@/utils/auth'

const userId = getUserId()
const homeStore = useHomeStore()
const query = reactive({
  userId: userId,
  page: 1,
  pageSize: 10,
  keyword: ''
})

const search = async () => {
  const list: RecommendDraft[] = await searchDrafts(query)
  homeStore.setKeyword(query.keyword) // 存储搜索关键字

  if (list && list.length > 0) {
    const buildList = buildRecommendList(list)
    homeStore.setRecommendList(buildList)
  } else {
    ElMessage.error('未搜索到相关文章')
  }
}

</script>

<style scoped lang="scss"></style>