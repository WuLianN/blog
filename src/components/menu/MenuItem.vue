<template>
  <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
    <template #title>
      <el-image class="image" v-if="item.meta && item.meta.icon" :src="item.meta && item.meta.icon" />
      {{ item.name }}
    </template>

    <!-- 组件自调 -->
    <menu-item v-for="(ele, index) in item.children" :item="ele" :key="index" />
  </el-sub-menu>

  <el-menu-item v-else :index="item.path" @click="jump(item.path)">
    <template #title>
      <el-image class="image" v-if="item.meta && item.meta.icon" :src="item.meta && item.meta.icon" />
      {{ item.name }}
    </template>
  </el-menu-item>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  item: {
    type: Object,
    default: () => []
  }
})

defineOptions({
  name: 'menuItem'
})


function jump(path: string) {
  router.push(path)
}
</script>

<style scoped lang="scss">
.image {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
</style>