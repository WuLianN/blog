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

const homeStore = useHomeStore()
const query = reactive({
  page: 1,
  page_size: 10,
  keyword: ''
})

const search = async () => {
  const list: RecommendDraft[] = await searchDrafts(query)

  if (list && list.length > 0) {
    const buildList = buildRecommendList(list)
    homeStore.setRecommendList(buildList)
  } else {
    ElMessage.error('未搜索到相关文章')
  }
}

</script>

<style scoped lang="scss"></style>