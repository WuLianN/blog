<template>
  <Card :list="recommendList" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { getRecommendList } from '@/api/base'
import { getUserId } from '@/utils/auth'
import { useHomeStore } from '@/store/modules/home'
import { getExcerpt } from '@/utils/three_party'
import { debounce } from 'lodash-es'
import { getFirstImageUrl } from '@/utils/blog'
import { RecommendDraft } from '@/api/model/draftsModel'

const userId = getUserId()
const recommendList = ref<RecommendDraft[]>([])
const homeStore = useHomeStore()

const query = ref(
  {
    userId: userId,
    page: 1,
    pageSize: 10
  }
)
const debounceScrollFn = debounce(handleScroll, 300)

getList()

// 侦听store中的推荐列表 tip: 切换分类会更新store中的推荐列表
watch(() => homeStore.recommendList, (value) => {
  recommendList.value = value
})

async function getList() {
  const list: RecommendDraft[] = await getRecommendList(query.value)

  if (list.length === 0) {
    ElMessage.warning("没有更多了！")

    return
  }

  list.map(item => {
    if (item.content) {
      item.excerpt = getExcerpt(item.content as string)
      item.bgImage = getFirstImageUrl(item.content as string)
    }
  })

  recommendList.value.push(...list)
}


async function handleScroll() {
  const scrollTop = Math.floor(document.documentElement.scrollTop);
  const scrollHeight = Math.floor(document.documentElement.scrollHeight);
  const clientHeight = Math.floor(document.documentElement.clientHeight);

  // 检测是否滚动到底部
  if (scrollHeight - scrollTop <= clientHeight + 10) {
    query.value.page += 1

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