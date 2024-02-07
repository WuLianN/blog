<template>
  <template v-if="menuList && menuList.length > 0">
    <el-menu :default-active="defaultActive" class="el-menu-vertical" :collapse="isCollapse" @open="handleOpen"
      @close="handleClose">
      <template v-for="(child, index) in menuList" :key="index">
        <menu-item :item="child" />
      </template>
    </el-menu>
  </template>
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

const userId = getUserId()

getList(userId)

async function getList(id: LocationQueryValue | LocationQueryValue[]) {
  const result = await getMenuList(id)

  menuList.value = result

  defaultActive.value = result[0].path
}
</script>

<style>
.el-menu-vertical {
  border: 1px solid #ebeef5;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
