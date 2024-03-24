<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useHomeStore } from '@/store/modules/home'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
const store = useHomeStore()
const cardStatus = ref(false)
const defaultAvatar = 'https://api.bearcub.club/static/f59dba31b7e35b34915a46af75b037f2.png'
const avatar = computed(() => {
  return userStore.userInfo.avatar || defaultAvatar
})

function avatarClick(e: Event) {
  e.stopPropagation()

  cardStatus.value = !cardStatus.value
  store.setLoginCardStatus(cardStatus.value)
}

watch(() => store.status, (value) => {
  cardStatus.value = value
})
</script>

<template>
  <div class="avatar" @click="avatarClick">
    <el-avatar :size="50" :src="avatar" />

    <Login-Card :status="cardStatus" />
  </div>
</template>

<style scoped lang="scss">
.avatar {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}
</style>
