<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { updateUserInfo } from '@/api/user'

const userStore = useUserStore()

const form = reactive({
  username: '',
  isPrivacy: false,
})

const localUserInfo = localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo') as string)

const avatar = ref('')
avatar.value = userStore.userInfo.avatar || localUserInfo.avatar
form.username = userStore.userInfo.user_name || localUserInfo.user_name
form.isPrivacy = userStore.userInfo.is_privacy ? true : !!(false || localUserInfo.is_privacy)

const link = ref('')
const userId = userStore.userInfo.id || localUserInfo.id

link.value = `${location.origin}/user/${userId}`

function handleImageChange(url: string) {
  avatar.value = url
}

async function submit() {
  const data = {
    id: userStore.userInfo.id,
    avatar: avatar.value,
    user_name: form.username,
    is_privacy: form.isPrivacy ? 1 : 0,
  }

  try {
    const userInfo = await updateUserInfo(data)
    if (userInfo) {
      // 更新用户信息 storage store
      userStore.setUserInfo(userInfo)
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    }
    ElMessage.success('修改成功!')
  }
  catch {
    ElMessage.error('修改失败!')
  }
}
</script>

<template>
  <el-form label-width="80px" label-position="left">
    <el-form-item label="昵称">
      <el-input v-model="form.username" />
    </el-form-item>
    <el-form-item label="头像">
      <avatar-upload :width="128" :height="128" :img-url="avatar" @change="handleImageChange" />
    </el-form-item>
    <el-form-item label="私密账号">
      <el-switch v-model="form.isPrivacy" size="large" inline-prompt active-text="是" inactive-text="否" />
    </el-form-item>
    <el-form-item label="个人主页">
      <el-link type="primary" :href="link" target="_blank">
        {{ link }}
      </el-link>
    </el-form-item>
    <el-form-item>
      <el-button plain type="primary" @click="submit">
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
