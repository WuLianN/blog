<template>
  <div class="menu" v-if="menuList && menuList.length > 0">
    <el-menu :defaultActive="defaultActive" :defaultOpeneds="defaultOpeneds" class="el-menu-vertical"
      :collapse="isCollapse" @open="handleOpen" @close="handleClose">
      <template v-for="(child, index) in menuList" :key="index">
        <menu-item :item="child" />
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { getMenuList } from '@/api/menu'
import { useRoute, type LocationQueryValue } from 'vue-router'
import { getUserId } from '@/utils/auth'

const isCollapse = ref(false)

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const menuList = ref([])
const defaultActive = ref('')
const defaultOpeneds = ref([])

const userId = getUserId()

getList(userId)

async function getList(id: LocationQueryValue | LocationQueryValue[]) {
  const result = await getMenuList(id)

  menuList.value = result

  defaultActive.value = result ? result[0].id : ''
  defaultOpeneds.value = result ? [result[0].id] : []
}
</script>

<style scoped>
.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.menu {
  position: sticky;
  top: 80px;
  left: 0;

  box-shadow: var(--el-box-shadow-light);

  border-radius: var(--el-card-border-radius);
  border: 1px px solid var(--el-card-border-color);
  background-color: var(--el-card-bg-color);
  overflow: hidden;
  color: var(--el-text-color-primary);
  transition: var(--el-transition-duration);
}
</style>
