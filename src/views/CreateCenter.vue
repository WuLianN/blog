<template>
  <div class="create-center">
    <el-button type="primary" @click="writeArticle()">写文章</el-button>
  </div>

</template>

<script setup lang="ts">
import { useNavigateTo } from '@/hooks/web/useNavigate.ts'
import { createDraft } from '@/api/drafts'

async function writeArticle() {
  const { draft_id: id } = await createDraft()
  useNavigateTo(`/drafts/${id}`)
}
</script>

<style scoped lang="scss">
.create-center {
  width: 100%;
  min-height: 100vh;
}
</style>