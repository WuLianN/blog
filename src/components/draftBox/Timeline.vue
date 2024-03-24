<script setup lang="ts">
import { Clock, Delete } from '@element-plus/icons-vue'
import type { PropType } from 'vue'
import { useNavigateTo } from '@/hooks/web/useNavigate'
import { formatDate } from '@/utils/three_party'
import { deleteDraft } from '@/api/drafts'
import type { Draft } from '@/api/model/draftsModel'

defineProps({
  list: {
    type: Array as PropType<Draft[]>,
    default: () => [],
  },
})

const emit = defineEmits(['delete'])

function to(id: number) {
  useNavigateTo({ path: `/drafts/${id}` })
}

async function del(id: number, event: Event) {
  event.stopPropagation()
  try {
    await deleteDraft(id)
    ElMessage.success('删除成功!')

    emit('delete', id)
  }
  catch {
    ElMessage.error('删除失败!')
  }
}
</script>

<template>
  <el-timeline>
    <el-timeline-item
      v-for="(item, index) in list" :key="index" center :timestamp="formatDate(item.update_time, 'YYYY-MM-DD')"
      type="primary" size="large" :icon="item.update_time !== item.create_time ? Clock : ''"
      placement="top" @click="to(item.id)"
    >
      <div class="card">
        <el-card>
          <div class="card-title">
            <el-text type="primary" size="large">
              {{ item.title }}
            </el-text>
          </div>
          <el-text>创建时间 {{ formatDate(item.create_time) }}</el-text>

          <div class="card-delete">
            <el-button size="large" plain type="danger" :icon="Delete" circle @click="del(item.id, $event)" />
          </div>
        </el-card>
      </div>
    </el-timeline-item>
  </el-timeline>
</template>

<style scoped lang="scss">
.card {
  position: relative;
  cursor: pointer;
}

.card-title {
  margin-bottom: 20px;
}

.card-delete {
  position: absolute;
  top: 50%;
  left: 90%;
  transform: translate(-50%, -50%);
}
</style>
