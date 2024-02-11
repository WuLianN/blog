<template>
  <div class="card" v-show="status" @click="cardClick($event)">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-avatar :size="50" :src="avatar" />
          <div class="card-header-username">{{ userStore.userInfo.user_name ?? '' }}</div>
        </div>
      </template>

      <div class="card-btn-wrapper">
        <el-button plain type="primary" @click="go('/draftBox')">草稿箱</el-button>
        <el-button plain type="primary" @click="go('/articleManage')">文章管理</el-button>
      </div>

      <template #footer>
        <div class="card-footer">
          <a class="card-footer__link" @click="go('/setting')">我的设置</a>
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
const defaultAvatar = 'http://127.0.0.1:8000/static/f59dba31b7e35b34915a46af75b037f2.png'
const avatar = ref('')
avatar.value = userStore.userInfo.avatar ?? defaultAvatar

watch(() => userStore.userInfo.avatar, (value) => {
  if (value) {
    avatar.value = value
  }
})

function cardClick(e: Event) {
  e.stopPropagation()
}

function logout() {
  localStorage.removeItem('token')

  useNavigateTo({ path: '/login', query: { type: 'login' } })
}

function go(path) {
  useNavigateTo(path)
}
</script>

<style scoped lang="scss">
.card {
  position: absolute;
  top: var(--el-header-height);
  right: 50px;
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

  &-btn-wrapper {
    width: 180px;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-self: center;
    padding-top: 10px; // 补button margin-bottom: 10px;
  }
}

.el-button+.el-button {
  margin-left: 0;
}

.el-button {
  margin-bottom: 10px;
}

:deep(.el-card__body) {
  padding: 10px;
}
</style>