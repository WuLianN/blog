<script setup lang="ts">
import { useDark } from '@vueuse/core'

import { Moon, Sunny } from '@element-plus/icons-vue'

const isDark = useDark()
</script>

<template>
  <el-switch v-model="isDark" style="--el-switch-on-color: #2c2c2c;" size="large">
    <template #active-action>
      <el-icon>
        <Moon class="dark-icon" />
      </el-icon>
    </template>
    <template #inactive-action>
      <el-icon>
        <Sunny class="light-icon" />
      </el-icon>
    </template>
  </el-switch>
</template>

<style scoped lang="scss">
.light-icon {
  color: #606266;
}

.dark-icon {
  color: #141414;
}
</style>
