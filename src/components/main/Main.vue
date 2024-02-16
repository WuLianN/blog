<template>
  <Card :list="recommendList" />
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { getRecommendList } from '@/api/base'
import { getUserId } from '@/utils/auth'
import { useHomeStore } from '@/store/modules/home'
import { debounce } from 'lodash-es'
import { RecommendDraft } from '@/api/model/draftsModel'
import { buildRecommendList } from '@/utils/blog'
import { searchDrafts } from '@/api/drafts'

const userId = getUserId()
const recommendList = ref<RecommendDraft[]>([])
const homeStore = useHomeStore()

const query = reactive(
  {
    userId: userId,
    page: 1,
    pageSize: 10,
    keyword: ''
  }
)
const debounceScrollFn = debounce(handleScroll, 300)

getList()

// 侦听store中的推荐列表 tip: 切换分类会更新store中的推荐列表
watch(() => homeStore.recommendList, (value) => {
  recommendList.value = value
})

// 侦听store中的搜索关键字
watch(() => homeStore.keyword, (value) => {
  query.keyword = value
})

async function getList() {
  const list: RecommendDraft[] = []

  let result = []
  if (!query.keyword) {
    // 推荐模式
    result = await getRecommendList(query)
  } else {
    // 搜索模式 关键字
    result = await searchDrafts(query)
  }

  list.push(...result)

  if (list.length === 0) {
    ElMessage.warning("没有更多了！")

    return
  }

  const buildList = buildRecommendList(list)

  recommendList.value.push(...buildList)
}


async function handleScroll() {
  const scrollTop = Math.floor(document.documentElement.scrollTop);
  const scrollHeight = Math.floor(document.documentElement.scrollHeight);
  const clientHeight = Math.floor(document.documentElement.clientHeight);

  // 检测是否滚动到底部
  if (scrollHeight - scrollTop <= clientHeight + 10) {
    query.page += 1

    getList()
  }
}

onMounted(() => {
  // 监听滚动事件
  window.addEventListener('scroll', debounceScrollFn);
})

onUnmounted(() => {
  window.removeEventListener('scroll', debounceScrollFn)
})
</script>

<style scoped lang="scss"></style>