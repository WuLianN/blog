<template>
  <div class="view">
    <div class="view-container">
      <Viewer :content="content" />
    </div>

    <back-top />
  </div>

  <UseDraggable :initial-value="{ x: dragX, y: 300 }" style="position: fixed;" v-is-author="userId"
    storage-key="vueuse-draggable" storage-type="session">
    <div class="btn-wrapper">
      <el-button type="primary" circle :icon="Edit" @click="edit" size="large"></el-button>
    </div>
  </UseDraggable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Viewer from '@blog/markdown-editor/src/components/Viewer.vue'
import { useRoute } from 'vue-router'
import { getDraft } from '@/api/drafts'
import { useDark } from '@vueuse/core'
import { Edit } from '@element-plus/icons-vue'
import { useNavigateTo } from '@/hooks/web/useNavigate'
import { UseDraggable } from '@vueuse/components'

const content = ref('')
const draftId = getDraftId()
const userId = ref<number>(0)

const screenWidth = window.innerWidth

const dragX = ref<number>(screenWidth - 80 - 100) // 80是div的宽度

if (screenWidth < 1000) {
  dragX.value = screenWidth - 80 - 20
}

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
    const { content: contentAlia, user_id } = await getDraft({ id: parseInt(draftId, 10) })
    content.value = contentAlia
    userId.value = user_id
  }
}

function edit() {
  draftId && useNavigateTo(`/drafts/${draftId}`)
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

.btn-wrapper {
  width: 80px;
  height: 80px;
  cursor: move;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
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