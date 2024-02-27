<template>
  <div class="container" @click="handleClick">
    <el-header class="header">
      <Header />
    </el-header>
    <div class="container-main__wrapper">
      <div class="container-main">
        <div class="aside aside-left">
          <Menu />
        </div>

        <div class="main">
          <Main />
        </div>

        <div class="aside aside-right" ref="asideRight">

        </div>
      </div>
    </div>

    <back-top />
  </div>
</template>

<script setup lang="ts">
import { useHomeStore } from '@/store/modules/home';
import { useUserStore } from '@/store/modules/user';
import { getUserId } from '@/utils/auth'
import { getUserInfo, getUserSetting } from '@/api/user'
import { watch, ref } from 'vue'
import { setupTheme } from '@/hooks/web/useTheme'

const homeStore = useHomeStore()
const userStore = useUserStore()

const asideRight = ref<any>(null)

const userId = getUserId()

userId && userStore.setUser({ id: userId })

queryUserInfo(userId)
queryUserSetting(userId)

watch(() => homeStore.menuList, (list) => {
  if (list && list.length > 0) {
    asideRight.value.style.width = '200px'
  } else {
    asideRight.value.style.width = 0
  }
})

function handleClick(e: Event) {
  e.stopPropagation();

  homeStore.setLoginCardStatus(false)
}

async function queryUserInfo(userId?: number | null) {
  const userInfo = await getUserInfo(userId)
  userInfo && localStorage.setItem("visitUserInfo", JSON.stringify(userInfo))
  userInfo && userStore.setUserInfo(userInfo)
}

async function queryUserSetting(userId?: number | null) {
  const result = await getUserSetting(userId)
  if (result) {
    localStorage.setItem("user_setting", JSON.stringify(result))
    userStore.setUserSetting(result)

    setupTheme()
  }
}
</script>

<style scoped lang="scss">
.container {
  min-height: 100vh;
  background-color: var(--app-bg-color);
  box-sizing: border-box;
}

.header {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1000;
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
    width: 100vw;
  }
}
</style>