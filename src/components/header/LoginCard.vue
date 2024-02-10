<template>
  <div class="card" v-show="status" @click="cardClick($event)">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-avatar :size="50" :src="avatar" />
          <div class="card-header-username">{{ userStore.userInfo.user_name ?? '' }}</div>
        </div>
      </template>

      <template #footer>
        <div class="card-footer">
          <a class="card-footer__link" @click="goSetting">我的设置</a>
          <a class="card-footer__link" @click="logout">退出登录</a>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useNavigateTo } from '@/hooks/web/useNavigate'
import { useUserStore } from '@/store/modules/user'

defineProps({
  status: {
    type: Boolean,
    default: false
  }
})

const userStore = useUserStore()
const avatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

watch(() => userStore.userInfo.avatar, (value) => {
  avatar.value = value
})

function cardClick(e: Event) {
  e.stopPropagation()
}

function logout() {
  localStorage.removeItem('token')

  useNavigateTo({ path: '/login', query: { type: 'login' } })
}

function goSetting() {
  useNavigateTo('/setting')
}
</script>

<style scoped lang="scss">
.card {
  position: absolute;
  top: var(--el-header-height);
  right: 20px;
  z-index: 999;

  &-header {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    &-username {
      margin-left: 10px;
      font-size: 14px;
      color: var(--el-color-text-primary);
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &-footer {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;

    &__link {
      font-size: 12px;
      cursor: pointer;
    }
  }
}
</style>