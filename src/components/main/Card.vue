<template>
  <el-card class="card" v-for="(item, index) in list" :key="index" @click="jump(item.id)">
    <template #header>
      <div>
        {{ item.title }}
      </div>
    </template>
    <div>{{ item.excerpt }}</div>
    <template #footer>
      <div class="footer">
        <div>
          <el-tag v-for="tag in item.tags" :key="tag.id">{{ tag.name }}</el-tag>
        </div>
        <div>{{ formatDate(item.create_time, "YYYY-MM-DD") }}</div>
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { useNavigateToNewTag } from '@/hooks/web/useNavigate'
import { formatDate } from '@/utils/three_party'

defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})

function jump(id) {
  useNavigateToNewTag(`/viewer/${id}`)
}
</script>

<style scoped lang="scss">
.card {
  width: 100%;
  margin-bottom: 20px;
  cursor: pointer;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-tag + .el-tag) {
  margin-left: 10px;
}
</style>