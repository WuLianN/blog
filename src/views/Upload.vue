<template>
  <div class="container">
    <el-form label-width="80px" label-position="top">
      <el-form-item label="图片">
        <avatar-upload :width="128" :height="128" @change="handleImageChange" :imgUrl="avatar" />
      </el-form-item>
      <el-form-item label="链接">
        <el-link type="primary" :href="avatar" target="_blank">{{ avatar }}</el-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const avatar = ref('')

function handleImageChange(url: string) {
  avatar.value = url
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;

  padding-top: 20px
}

</style>