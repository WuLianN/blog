<template>
  <div class="draft-box">
    <div class="draft-box-timeline">
      <Timeline :list="list" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getDraftList } from '@/api/drafts';

const query = ref({
  page: 1,
  pageSize: 10,
});

const list = ref([])

getList()

async function getList() {
  const resultList: never[] = await getDraftList(query.value);
  list.value.push(...resultList)
}
</script>

<style scoped lang="scss">
.draft-box {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;

  &-timeline {
    width: 800px;
  }
}
</style>