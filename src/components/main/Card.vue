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
        <div></div>
        <div>{{ item.update_time }}</div>
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { useNavigateTo } from '@/hooks/web/useNavigate'

defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})

function jump(id) {
  useNavigateTo(`/viewer/${id}`)
}
</script>

<style scoped lang="scss">
.card {
  margin-bottom: 20px;
  cursor: pointer;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>