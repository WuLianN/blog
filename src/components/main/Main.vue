<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { debounce } from 'lodash-es'
import { getRecommendList } from '@/api/base'
import { getUserId } from '@/utils/auth'
import { useHomeStore } from '@/store/modules/home'
import type { RecommendDraft } from '@/api/model/draftsModel'
import { buildRecommendList } from '@/utils/blog'
import { searchDrafts } from '@/api/drafts'
import { scrollToTop } from '@/utils/utils'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
const userId = getUserId() || userStore.userInfo.id || JSON.parse(localStorage.getItem('userInfo') || '{}')?.id
const recommendList = ref<RecommendDraft[]>([])
const homeStore = useHomeStore()
let shouldLoadMore = true
const isEmpty = ref(false)

const query = reactive(
  {
    userId,
    page: 1,
    pageSize: 10,
    keyword: '',
    tagIds: '',
  },
)
const debounceScrollFn = debounce(handleScroll, 300)

getList()

// 侦听store中的推荐列表 tip: 切换分类会更新store中的推荐列表
watch(() => homeStore.recommendList, (value) => {
  recommendList.value = value
  shouldLoadMore = false
  scrollToTop()
})

// 侦听store中的搜索关键字
watch(() => homeStore.keyword, (value) => {
  query.page = 1
  query.keyword = value
  shouldLoadMore = false
  scrollToTop()
})

// 侦听store中的tagIds
watch(() => homeStore.tagIds, (value) => {
  query.page = 1
  query.tagIds = value
  shouldLoadMore = false
  scrollToTop()
})

async function getList() {
  const list: RecommendDraft[] = []

  let result = []
  if (!query.keyword) {
    // 推荐模式
    result = await getRecommendList(query)
  }
  else {
    // 搜索模式 关键字
    result = await searchDrafts(query)
  }

  list.push(...result)

  if (list.length === 0 && query.page > 1) {
    ElMessage.warning('没有更多了！')
    return
  }

  const buildList = buildRecommendList(list)

  recommendList.value.push(...buildList)

  if (list.length === 0) {
    isEmpty.value = true
  }
  else {
    isEmpty.value = false
  }
}

function resetQuery() {
  query.page = 1
  query.tagIds = ''
  query.keyword = ''
}

async function handleTagClick(tagId: number) {
  resetQuery()
  query.tagIds = tagId.toString()
  recommendList.value = []

  getList()
}

async function handleScroll() {
  if (!shouldLoadMore) {
    shouldLoadMore = true
    return
  }

  const scrollTop = Math.floor(document.documentElement.scrollTop)
  const scrollHeight = Math.floor(document.documentElement.scrollHeight)
  const clientHeight = Math.floor(document.documentElement.clientHeight)

  // 检测是否滚动到距离底部60px
  if (scrollHeight - scrollTop <= clientHeight + 60) {
    query.page += 1

    getList()
  }
}

onMounted(() => {
  // 监听滚动事件
  window.addEventListener('scroll', debounceScrollFn)
})

onUnmounted(() => {
  window.removeEventListener('scroll', debounceScrollFn)
})
</script>

<template>
  <template v-if="recommendList.length > 0">
    <Card :list="recommendList" @tag-click="handleTagClick" />
  </template>
  <template v-if="isEmpty">
    <Empty />
  </template>
</template>

<style scoped lang="scss"></style>
