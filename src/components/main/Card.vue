<template>
  <el-card class="card" v-for="(item, index) in list" :key="index" @click="jump(item.id)">
    <template #header>
      <div>
        <el-text type="primary" size="large">{{ item.title }}</el-text>
      </div>
    </template>
    <div class="content">
      <div class="content-excerpt" :class="{ 'content-excerpt--no-img': !item.bgImage }">{{ item.excerpt }}</div>
      <div class="content-img-wrapper" v-if="item.bgImage" @click="imgClick(item.bgImage, $event)">
        <el-image class="content-img" :lazy="true" fit="scale-down" :src="item.bgImage"
          :preview-src-list="previewSrcList" :zIndex="0" :hide-on-click-modal="true" />
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <div>
          <el-tag @click.stop="tagClick(tag.id)" v-for="tag in item.tags" :key="tag.id"
            :style="{ backgroundColor: tag.bg_color, color: tag.color }">{{
    tag.name }} </el-tag>
        </div>
        <div>
          <el-text>{{ formatDate(item.create_time, "YYYY-MM-DD") }}</el-text>
        </div>
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { useNavigateToNewTag } from '@/hooks/web/useNavigate'
import { formatDate } from '@/utils/three_party'
import { RecommendDraft } from '@/api/model/draftsModel'
import { PropType, ref } from 'vue'

const previewSrcList = ref<string[]>([''])

defineProps({
  list: {
    type: Array as PropType<RecommendDraft[]>,
    default: () => [],
  },
})

const emit = defineEmits(['tagClick'])

function tagClick(id: number) {
  emit('tagClick', id)
}

function jump(id: number) {
  useNavigateToNewTag(`/viewer/${id}`)
}

function imgClick(url: string, event: Event) {
  previewSrcList.value = [url]
  event.stopPropagation()
}
</script>

<style scoped lang="scss">
.card {
  width: 100%;
  margin-bottom: 20px;
  cursor: pointer;
}

.content {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;

  &-excerpt {
    width: calc(100% - 130px);
    overflow-wrap: break-word;
    white-space: normal;
  }

  &-img-wrapper {
    width: 100px;
    height: 100px;
    z-index: 1001;
  }

  &-img {
    width: inherit;
    height: inherit;
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-tag + .el-tag) {
  margin-left: 10px;
}

.content-excerpt--no-img {
  width: 100%;
}

:deep(.el-tag) {
  border-color: transparent !important;
}
</style>