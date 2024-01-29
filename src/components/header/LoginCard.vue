<template>
  <div class="card" v-show="status" @click="cardClick($event)">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-avatar :size="50" :src="circleUrl" />
          <div class="card-header-username">xx人的博客系统</div>
        </div>
      </template>

      <template #footer>
        <div class="card-footer">
          <a class="card-footer__link">我的设置</a>
          <a class="card-footer__link" @click="logout">退出登录</a>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  status: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const circleUrl = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

function cardClick(e: Event) {
  e.stopPropagation()
}

function logout() {
  localStorage.removeItem('token')

  router.push({ path: '/login', query: { type: 'login' } })
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