<template>
  <div class="avatar" @click="avatarClick">
    <el-avatar :size="50" :src="circleUrl" />

    <Login-Card :status="cardStatus" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useHomeStore } from '@/store/modules/home'

const store = useHomeStore()
const cardStatus = ref(false)

const circleUrl = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

function avatarClick(e: Event) {
  e.stopPropagation()

  cardStatus.value = !cardStatus.value
  store.setLoginCardStatus(cardStatus.value)
}

watch(() => store.status, (value) => {
  cardStatus.value = value
})

</script>

<style scoped lang="scss">

</style>