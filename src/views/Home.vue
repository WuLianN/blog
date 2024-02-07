<template>
  <div class="container" @click="handleClick">
    <el-header class="header">
      <Header />
    </el-header>
    <el-main class="container-main__wrapper">
      <div class="container-main">
        <div class="aside aside-left">
          <Menu />
        </div>

        <div class="main">
          <Main />
        </div>

        <div class="aside aside-right">
          <Menu />
        </div>
      </div>
    </el-main>
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
  width: 100vw;
  min-height: 100vh;
  background-color: var(--app-bg-color);
  box-sizing: border-box;
}

.header {
  width: 100vw;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 9999;
}

.container-main__wrapper {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}

.container-main {
  max-width: 1200px;
  display: flex;
  flex-flow: row nowrap;
}

.aside {
  padding: 20px;
}

.main {
  width: 720px;
  display: flex;
  flex-flow: column nowrap;
  padding: 20px;
}

:deep(.el-header) {
  padding: 0 !important;
}

// xs < 768px
@media screen and (max-width: 768px) {
  .aside {
    display: none;
  }
}

@media screen and (min-width: 768px) and (max-width: 992px) {
  .aside-left {
    width: auto;
  }

  .aside-right {
    display: none;
  }
}

@media screen and (min-width: 992px) and (max-width: 1200px) {
  .aside-left {
    width: auto;
  }

  .aside-right {
    display: none;
  }
}

// 最大992px 宽度自适应
@media screen and (max-width: 992px) {
  .main {
    width: auto;
  }
}
</style>