<script setup lang="ts">
import { ref, watch } from 'vue'
import { useNavigateTo } from '@/hooks/web/useNavigate'
import { useUserStore } from '@/store/modules/user'

defineProps({
  status: {
    type: Boolean,
    default: false,
  },
})

const previewSrcList = ref<string[]>([''])
const userStore = useUserStore()
const avatar = ref('')
const defaultAvatar = 'https://api.bearcub.club/static/f59dba31b7e35b34915a46af75b037f2.png'
avatar.value = userStore.userInfo.avatar || defaultAvatar

watch(() => userStore.userInfo.avatar, (value) => {
  if (value)
    avatar.value = value
})

function cardClick(e: Event) {
  e.stopPropagation()
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  userStore.logout()

  useNavigateTo({ path: '/login', query: { type: 'login' } })
}

function go(path: string) {
  useNavigateTo(path)
}

function imgClick(url: string) {
  previewSrcList.value = [url]
}
</script>

<template>
  <div v-show="status" class="card" @click="cardClick($event)">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-image class="card-header-avatar" :src="avatar" :preview-src-list="previewSrcList" :z-index="0" :hide-on-click-modal="true" @click.stop="imgClick(avatar)" />
          <div class="card-header-username">
            {{ userStore.userInfo.user_name ?? '' }}
          </div>
        </div>
      </template>

      <div v-isBrower class="card-btn-wrapper">
        <el-button plain type="primary" @click="go('/draftBox')">
          草稿箱
        </el-button>
        <el-button plain type="primary" @click="go('/articleManage')">
          文章管理
        </el-button>
        <el-button plain type="primary" @click="go('/toolkit')">
          工具箱
        </el-button>
      </div>

      <template #footer>
        <div v-isBrower class="card-footer">
          <a class="card-footer__link" @click="go('/setting')">我的设置</a>
          <a class="card-footer__link" @click="logout">退出登录</a>
        </div>
      </template>
    </el-card>
  </div>
</template>

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

    &-avatar {
      width: 50px;
      height: 50px;
      overflow: hidden;
      border-radius: 50%;
    }

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

@media screen and (max-width: 992px) {
  .card {
    right: 20px;
  }
}
</style>
