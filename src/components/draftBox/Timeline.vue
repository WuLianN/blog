
<template>
  <el-timeline>
    <el-timeline-item @click="to(item.id)" v-for="(item, index) in list" :key="index" center :timestamp="item.update_time"
      placement="top">
      <el-card>
        <h4>{{ item.title }}</h4>
        <p>创建时间 {{ item.create_time }}</p>
      </el-card>
    </el-timeline-item>
  </el-timeline>
</template>

<script setup lang="ts">
import { useNavigateTo } from '@/hooks/web/useNavigate';

defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

function to(id) {
  useNavigateTo({ path: `/viewer/${id}` })
}
</script>

<style scoped lang="scss"></style>