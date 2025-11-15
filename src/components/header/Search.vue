<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { searchDrafts } from '@/api/drafts'
import type { RecommendDraft } from '@/api/model/draftsModel'
import { useHomeStore } from '@/store/modules/home'
import { buildRecommendList } from '@/utils/blog'
import { getUserId } from '@/utils/auth'

const userId = getUserId()
const homeStore = useHomeStore()
const query = reactive({
  userId,
  page: 1,
  pageSize: 10,
  keyword: '',
  searchType: 1,
})

const searchOptions = [
  {
    value: 1,
    label: '当前账号',
  },
  {
    value: 2,
    label: '关联账号',
  },
]

async function search() {
  // 重置页码为第一页
  query.page = 1

  const list: RecommendDraft[] = await searchDrafts(query)
  homeStore.setKeyword(query.keyword) // 存储搜索关键字

  if (list && list.length > 0) {
    const buildList = buildRecommendList(list)
    homeStore.setRecommendList(buildList)
  }
  else {
    ElMessage.error('未搜索到相关文章')
  }
}

// 监听搜索类型的变更
watch(
  () => query.searchType,
  () => {
    // 当搜索关键词不为空时，重新搜索
    if (query.keyword) {
      search()
    }
  },
)
</script>

<template>
  <el-input
    v-model="query.keyword"
    placeholder="搜索文章标题"
    :suffix-icon="Search"
    :clearable="true"
    :style="{ width: userId ? '200px' : '300px' }"
    @change="search"
  >
    <template v-if="!userId" #prepend>
      <el-select
        v-model="query.searchType"
        placeholder="Select"
        style="width: 100px"
      >
        <el-option
          v-for="item in searchOptions"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
    </template>
  </el-input>
</template>

<style scoped lang="scss"></style>
