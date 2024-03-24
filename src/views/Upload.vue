<script setup lang="ts">
import { ref } from 'vue'

const avatar = ref('')

function handleImageChange(url: string) {
  avatar.value = url
}
</script>

<template>
  <div class="container">
    <el-form label-width="80px" label-position="top">
      <el-form-item label="图片">
        <avatar-upload :width="128" :height="128" :img-url="avatar" @change="handleImageChange" />
      </el-form-item>
      <el-form-item label="链接">
        <div class="link-container">
          <el-link type="primary" :href="avatar" target="_blank">
            {{ avatar }}
          </el-link>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 20px;
}

.link-container {
  word-break: break-all;
}

@media screen and (max-width: 768px) {
  .container {
    justify-content: flex-start;
  }
}
</style>
