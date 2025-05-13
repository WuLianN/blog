<script setup lang="ts">
import { router } from '@/router'

const list = [
  {
    name: 'JSON 编辑器',
    path: '/toolkit/json-editor',
  },
]
function jump(path: string) {
  router.push(path)
}
</script>

<template>
  <el-container
    style="
      min-height: 100vh;
      background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
    "
  >
    <el-main>
      <el-row :gutter="20">
        <el-col v-for="(item, index) in list" :key="index" :span="6">
          <el-card shadow="hover" class="tool-card" @click="jump(item.path)">
            <div class="tool-item">
              <p>{{ item.name }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
.tool-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 20px;
  border-radius: 12px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: #f5f7fa;
  }
}
</style>
