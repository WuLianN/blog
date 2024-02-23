<template>
  <div class="btn-wrapper">
    <el-button type="primary" plain @click="login('login')">登录</el-button>
    <el-button type="success" plain @click="login('register')">注册</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function login(param: string) {
  router.push({
    path: '/login',
    query: {
      type: param
    }
  })
}
</script>

<style scoped lang="scss">
.btn-wrapper {
  display: flex;
  flex-flow: row nowrap;
}
</style>