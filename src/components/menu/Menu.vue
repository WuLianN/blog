<script lang="ts" setup>
import { ref } from 'vue'
import { getMenuList } from '@/api/menu'
import { getUserId } from '@/utils/auth'
import { useHomeStore } from '@/store/modules/home'

const isCollapse = ref(false)
const homeStore = useHomeStore()

function handleOpen(_key: string, _keyPath: string[]) {

}
function handleClose(_key: string, _keyPath: string[]) {

}

const menuList = ref<any[]>([])
const defaultActive = ref('')
const defaultOpeneds = ref<any[]>([])

const userId = getUserId()

getList(userId)

async function getList(id?: number | null) {
  const result = await getMenuList(id, 1)

  menuList.value = result

  homeStore.setMenuList(result)

  defaultActive.value = result ? result[0].id.toString() : ''
  defaultOpeneds.value = result && getDefaultOpeneds(result)
}

// 获取默认展开的菜单 [第一个]
function getDefaultOpeneds(result: any[]): string[] {
  const openeds: string[] = []
  const first = result.find((item: any) => item.children && item.children.length > 0)

  openeds.push(first ? first.id.toString() : '')
  return openeds
}
</script>

<template>
  <div v-if="menuList && menuList.length > 0" class="menu">
    <el-card>
      <el-menu
        :default-active="defaultActive" :default-openeds="defaultOpeneds" class="el-menu-vertical"
        :collapse="isCollapse" @open="handleOpen" @close="handleClose"
      >
        <template v-for="(child) in menuList" :key="child.id">
          <menu-item :item="child" />
        </template>
      </el-menu>
    </el-card>
  </div>
</template>

<style scoped>
.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

:deep(.el-sub-menu__title *) {
  vertical-align: middle !important;
}

.menu {
  position: sticky;
  top: 80px;
  left: 0;
}

:deep(.el-menu) {
  border: 0 !important;
}

:deep(.el-card__body) {
  padding: 0 !important;
}
</style>
