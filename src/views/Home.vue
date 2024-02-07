<template>
  <div class="container" @click="handleClick">
    <el-container>
      <el-header class="header">
        <Header />
      </el-header>
      <el-container>
        <el-aside class="aside aside-left">
          <Menu />
        </el-aside>
        <el-main class="main">
          <Main />
        </el-main>
        <el-aside class="aside aside-right">
          
        </el-aside>
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

  &-left {
    justify-content: flex-end;
  }

  &-right {
    justify-content: flex-start;
  }
}

.main {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
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
    margin-left: 20px;
  }

  .aside-right {
    display: none;
  }
}

@media screen and (min-width: 992px) and (max-width: 1200px) {
  .aside-left {
    width: auto;
    margin-left: 50px;
  }

  .aside-right {
    display: none;
  }
}

@media screen and (min-width: 1200px) and (max-width: 1300px) {
  .aside {
    width: 200px;
  }

  .aside-left {
    margin-left: 50px;
  }

  .aside-right {
    margin-right: 50px;
  }
}
</style>