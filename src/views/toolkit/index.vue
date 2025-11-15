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
    class="toolkit-container"
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
.toolkit-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);

  @at-root html.dark & {
    background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
  }
}

.tool-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 20px;
  border-radius: 12px;
  background-color: var(--el-bg-color-overlay);
  border-color: var(--el-border-color);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  @at-root html.dark & {
    &:hover {
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    }
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

  @at-root html.dark & {
    color: #f0f0f0;
  }

  &:hover {
    background-color: #f5f7fa;
  }

  @at-root html.dark & {
    &:hover {
      background-color: #3a3a3a;
    }
  }
}
</style>
