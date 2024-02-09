
<template>
  <el-timeline>
    <el-timeline-item @click="to(item.id)" v-for="(item, index) in list" :key="index" center
      :timestamp="formatDate(item.update_time, 'YYYY-MM-DD')" type="primary" size="large"
      :icon="item.update_time !== item.create_time ? Clock : ''" placement="top">
      <el-card>
        <h4>{{ item.title }}</h4>
        <p>创建时间 {{ formatDate(item.create_time) }}</p>
      </el-card>
    </el-timeline-item>
  </el-timeline>
</template>

<script setup lang="ts">
import { useNavigateTo } from '@/hooks/web/useNavigate';
import { formatDate } from '@/utils/three_party'
import { Clock } from '@element-plus/icons-vue'

defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

function to(id) {
  useNavigateTo({ path: `/drafts/${id}` })
}
</script>

<style scoped lang="scss"></style>