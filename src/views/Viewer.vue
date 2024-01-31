<template>
  <div class="view">
    <div class="view-container">
      <Viewer :content="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Viewer from '@blog/markdown-editor/src/components/Viewer.vue'
import { useRoute } from 'vue-router'
import { getDraft } from '@/api/drafts'

const content = ref('')
const draftId = getDraftId()

if (draftId) {
  getDraftDetail()
}

function getDraftId() {
  const route = useRoute()
  const { path } = route
  const regexp = /\/viewer\/(\d+)/
  const match = regexp.exec(path)
  return match?.[1]
}

async function getDraftDetail() {
  if (draftId) {
    const { content: contentAlia } = await getDraft({ id: parseInt(draftId, 10) })
    content.value = contentAlia
  }
}

</script>

<style scoped lang="scss">
.view {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;

  &-container {
    width: 800px;
  }
}

</style>