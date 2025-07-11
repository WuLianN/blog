<script setup lang="ts">
import { ref } from 'vue'

const imageStyles = ref({
  url: '',
})
const formStyles = ref({})

const login_designer = localStorage.getItem('login_designer')

if (login_designer) {
  const loginDesigner = JSON.parse(login_designer)

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
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}
</style>
