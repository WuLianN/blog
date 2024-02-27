<template>
  <el-color-picker v-model="color" @activeChange="activeChange" @change="update" show-alpha />
</template>

<script setup lang="ts">
import { useCssVar } from '@vueuse/core'
import { useTheme } from '@/hooks/web/useTheme'
import { updateUserSetting } from '@/api/user'
import { getUserId } from '@/utils/auth'
import { useUserStore } from '@/store/modules/user'
import { watch } from 'vue'

const userId = getUserId()

const primaryVarName = '--el-color-primary' // css变量名
const color = useCssVar(primaryVarName)
const userStore = useUserStore()

watch(() => userStore.userSetting.primary_color, (value) => {
  color.value = value
})

function activeChange(value: any) {
  useTheme(primaryVarName, value)
}

async function update() {
  // 非浏览模式，才允许更新主题色
  if (!userId) {
    await updateUserSetting({
      "primary_color": color.value
    })
  }
}
</script>

<style scoped lang="scss"></style>