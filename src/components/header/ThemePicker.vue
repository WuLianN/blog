<script setup lang="ts">
import { useCssVar } from '@vueuse/core'
import { watch } from 'vue'
import { useTheme } from '@/hooks/web/useTheme'
import { updateUserSetting } from '@/api/user'
import { getUserId } from '@/utils/auth'
import { useUserStore } from '@/store/modules/user'

const userId = getUserId()

const primaryVarName = '--el-color-primary' // css变量名
const color = useCssVar(primaryVarName)
const userStore = useUserStore()

watch(() => userStore.userSetting.primary_color, (value) => {
  if (value) {
    // 读取用户设置的主题色
    color.value = value
  }
  else {
    // 读取博客系统默认主题色
    const newColor = useCssVar(primaryVarName).value
    color.value = newColor
  }
})

function activeChange(value: any) {
  useTheme(primaryVarName, value)
}

async function update() {
  // 非浏览模式，才允许更新主题色
  if (!userId) {
    await updateUserSetting({
      primary_color: color.value,
    })
  }
}
</script>

<template>
  <el-color-picker v-model="color" show-alpha @active-change="activeChange" @change="update" />
</template>

<style scoped lang="scss"></style>
