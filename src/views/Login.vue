<script setup lang="ts">
import { ref } from 'vue'

const imageStyles = ref({
  url: '',
})
const formStyles = ref({})

const userSetting = localStorage.getItem('user_setting')

if (userSetting) {
  const { login_designer: loginDesigner } = JSON.parse(userSetting)

  if (loginDesigner) {
    const { form, image } = JSON.parse(loginDesigner)
    imageStyles.value = image
    formStyles.value = form
  }
}
</script>

<template>
  <div class="login">
    <LoginForm :style="formStyles" style="position: fixed; z-index: 1" />

    <img
      v-if="imageStyles.url"
      :src="imageStyles.url"
      :style="imageStyles"
      style="position: fixed"
    >
  </div>
</template>

<style scoped lang="scss">
.login {
  width: 100vw;
  height: 100vh;
}
</style>
