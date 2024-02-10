<template>
  <el-form label-width="50px" label-position="left">
    <el-form-item label="昵称">
      <el-input v-model="form.username" />
    </el-form-item>
    <el-form-item label="头像">
      <avatar-upload :width="128" :height="128" @change="handleImageChange" :imgUrl="avatar" />
    </el-form-item>
    <el-form-item>
      <el-button plain type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { updateUserInfo } from '@/api/user'

const userStore = useUserStore()

const form = reactive({
  username: '',
})

const avatar = ref('')
avatar.value = userStore.userInfo.avatar
form.username = userStore.userInfo.user_name ?? ''

function handleImageChange(url) {
  avatar.value = url
}

async function submit() {
  const data = {
    id: userStore.userInfo.id,
    avatar: avatar.value,
    user_name: form.username
  }
  await updateUserInfo(data)

  // 更新用户信息 storage store
  userStore.setUserInfo(data)
  localStorage.setItem('userInfo', JSON.stringify(data))
}
</script>

<style scoped lang="scss"></style>