<template>
  <div class="draft-box">
    <div class="draft-box-timeline">
      <Timeline :list="list" @delete="deleteDraft" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { getDraftList } from '@/api/drafts';
import { debounce } from 'lodash-es'

const query = ref({
  page: 1,
  pageSize: 10,
  status: 2 // 草稿
});

const debounceScrollFn = debounce(handleScroll, 300)

const list = ref<any[]>([])

getList()

async function getList() {
  const resultList: any[] = await getDraftList(query.value);

  if (resultList.length === 0) {
    ElMessage.warning("没有更多了！")
    return
  }

  list.value.push(...resultList)
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

function deleteDraft(id: number) {
  const index = list.value.findIndex(item => item.id === id)

  if (index !== -1) {
    list.value.splice(index, 1)
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