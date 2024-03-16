<template>
  <Waterfall :list="options.list" :rowKey="options.rowKey" :loadProps="options.loadProps">
    <template #item="{ item, url }">
      <div class="card" @mouseenter="handleMouseEnter(item.id)" @mouselevel="handleMouseLeave(item.id)">
        <LazyImg :url="url" />
        <div class="overlay" v-show="overlayMap[item.id]">
          <div class="overlay-text">
            {{ item.name }}
          </div>

          <el-button type="danger" circle size="large" @click="del(item.id)">
            <el-icon>
              <Delete />
            </el-icon>
          </el-button>
        </div>
      </div>
    </template>
  </Waterfall>
</template>

<script setup lang="ts">
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import { reactive, watch } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import type { ViewCard } from 'vue-waterfall-plugin-next/dist/types/types/waterfall'

const props = defineProps({
  options: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['delete'])

const overlayMap = reactive<any>({})

watch(props.options.list, (list) => {
  list.forEach((item: ViewCard) => {
    overlayMap[item.id as string] = false
  })
})

function resetOverlay() {
  Object.keys(overlayMap).forEach(key => {
    overlayMap[key] = false
  })
}

function handleMouseEnter(id: number) {
  resetOverlay()
  overlayMap[id] = true
}

function handleMouseLeave(id: number) {
  overlayMap[id] = false
}

function del(id: number) {
  ElMessageBox.confirm('此操作将永久删除该图片, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    emit('delete', id)
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}
</script>

<style scoped lang="scss">
.card {
  position: relative;
  width: 100%;
  height: 100%;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: inherit;
  height: inherit;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;

  &-text {
    width: inherit;
    padding: 10px 10px 0 10px;
    position: absolute;
    top: 0;
    left: 0;
    color: white;
    word-break: break-all;
  }
}
</style>