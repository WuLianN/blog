<template>
  <div class="view">
    <div class="view-container">
      <Viewer :content="content" />
    </div>

    <back-top />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Viewer from '@blog/markdown-editor/src/components/Viewer.vue'
import { useRoute } from 'vue-router'
import { getDraft } from '@/api/drafts'
import { useDark } from '@vueuse/core'
import { setColor } from '@/hooks/web/useTheme'

const content = ref('')
const draftId = getDraftId()

useDark()

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
    padding-bottom: 50px;
  }
}

// 暗黑模式，统一字体颜色吧
:deep(.markdown-body) {
  color: var(--app-markdown-body-color) !important;
}

@media screen and (max-width: 768px) {
  .view-container {
    width: 95%;
  }
}

@media screen and (min-width: 768px) and (max-width: 992px) {
  .view-container {
    width: 90%;
  }
}
</style>