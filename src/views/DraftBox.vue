<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { debounce } from 'lodash-es'
import { getDraftList } from '@/api/drafts'

const query = ref({
  page: 1,
  pageSize: 10,
  status: 2, // 草稿
})

const debounceScrollFn = debounce(handleScroll, 300)
const isEmpty = ref(false)

const list = ref<any[]>([])

getList()

async function getList() {
  const resultList: any[] = await getDraftList(query.value)

  if (resultList.length === 0 && query.value.page > 1) {
    ElMessage.warning('没有更多了！')
    return
  }

  list.value.push(...resultList)

  if (list.value.length === 0) {
    isEmpty.value = true
  }
  else {
    isEmpty.value = false
  }
}

async function handleScroll() {
  const scrollTop = Math.floor(document.documentElement.scrollTop)
  const scrollHeight = Math.floor(document.documentElement.scrollHeight)
  const clientHeight = Math.floor(document.documentElement.clientHeight)

  // 检测是否滚动到底部
  if (scrollHeight - scrollTop <= clientHeight + 10) {
    query.value.page += 1

    getList()
  }
}

function deleteDraft(id: number) {
  const index = list.value.findIndex(item => item.id === id)

  if (index !== -1)
    list.value.splice(index, 1)
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
  <div class="draft-box">
    <div v-if="list.length > 0" class="draft-box-timeline">
      <Timeline :list="list" @delete="deleteDraft" />
    </div>
    <template v-if="isEmpty">
      <Empty>
        <el-button type="primary" plain @click="$router.back()">
          返回首页
        </el-button>
      </Empty>
    </template>
  </div>
</template>

<style scoped lang="scss">
.draft-box {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  padding: 20px 0;

  &-timeline {
    width: 800px;
  }
}

@media screen and (max-width: 768px) {
  .draft-box-timeline {
    width: 90%;
  }
}

@media screen and (min-width: 768px) and (max-width: 992px) {
  .draft-box-timeline {
    width: 80%;
  }
}
</style>
