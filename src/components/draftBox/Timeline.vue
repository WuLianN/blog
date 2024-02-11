
<template>
  <el-timeline>
    <el-timeline-item @click="to(item.id)" v-for="(item, index) in list" :key="index" center
      :timestamp="formatDate(item.update_time, 'YYYY-MM-DD')" type="primary" size="large"
      :icon="item.update_time !== item.create_time ? Clock : ''" placement="top">
      <div class="card">
        <el-card>
          <div class="card-title">
            <el-text type="primary" size="large">{{ item.title }}</el-text>
          </div>
          <el-text>创建时间 {{ formatDate(item.create_time) }}</el-text>

          <div class="card-delete">
            <el-button @click="del(item.id, $event)" size="large" plain type="danger" :icon="Delete" circle />
          </div>
        </el-card>
      </div>
    </el-timeline-item>
  </el-timeline>
</template>

<script setup lang="ts">
import { useNavigateTo } from '@/hooks/web/useNavigate';
import { formatDate } from '@/utils/three_party'
import { Clock, Delete } from '@element-plus/icons-vue'
import { deleteDraft } from '@/api/drafts'

defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(["delete"])

function to(id) {
  useNavigateTo({ path: `/drafts/${id}` })
}

async function del(id, event) {
  event.stopPropagation()
  try {
    await deleteDraft(id)
    ElMessage.success('删除成功!')

    emit("delete", id)
  } catch {
    ElMessage.error('删除失败!')
  }
}
</script>

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