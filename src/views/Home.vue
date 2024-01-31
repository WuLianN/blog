<template>
  <div class="container" @click="handleClick">
    <el-container>
      <el-header class="header">
        <Header />
      </el-header>
      <el-container>
        <el-aside>
          <div class="aside">
            <Menu />
          </div>
        </el-aside>
        <el-main>
          <Main />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useHomeStore } from '@/store/modules/home';
import { useUserStore } from '@/store/modules/user';
import { getUserId } from '@/utils/auth'

const homeStore = useHomeStore()
const userStore = useUserStore()

const userId = getUserId()
userId && userStore.setUser({ id: userId })

function handleClick(e: Event) {
  e.stopPropagation();

  homeStore.setLoginCardStatus(false)
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  min-height: 100vh;
  background-color: var(--app-bg-color);
}

.header {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 9999;
}

.aside {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
}

:deep(.el-header) {
  padding: 0 !important;
}
</style>