<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Edit } from '@element-plus/icons-vue'
import { useNavigateTo } from '@/hooks/web/useNavigate'

const props = defineProps<{
  draftId?: string
}>()

// 拖动相关变量
const isDragging = ref(false)
const dragStartY = ref(0)
const dragStartTop = ref(0)
const buttonTop = ref(window.innerHeight / 3)

function edit() {
  props.draftId && useNavigateTo(`/drafts/${props.draftId}`)
}

// 开始拖动
function startDrag(e: MouseEvent) {
  isDragging.value = true
  dragStartY.value = e.clientY
  dragStartTop.value = buttonTop.value

  // 添加全局事件监听器
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)

  // 防止文本选择
  e.preventDefault()
}

// 停止拖动
function stopDrag() {
  isDragging.value = false

  // 移除全局事件监听器
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 拖动中
function onDrag(e: MouseEvent) {
  if (!isDragging.value) {
    return
  }

  const deltaY = e.clientY - dragStartY.value
  let newTop = dragStartTop.value + deltaY

  // 限制拖动范围
  const minHeight = 100
  const maxHeight = window.innerHeight - 100
  newTop = Math.max(minHeight, Math.min(maxHeight, newTop))

  buttonTop.value = newTop
}

// 监听窗口大小变化
function handleResize() {
  // 确保按钮不会超出窗口范围
  const maxHeight = window.innerHeight - 100
  if (buttonTop.value > maxHeight) {
    buttonTop.value = maxHeight
  }
}

// 组件挂载时添加事件监听器
onMounted(() => {
  // 添加窗口大小变化监听器
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<template>
  <div class="editor-btn-container" :style="{ top: `${buttonTop}px` }" @mouseenter="() => { }" @mouseleave="() => { }">
    <div class="editor-btn-toggle" @mousedown="startDrag">
      <el-icon size="20" color="white" style="cursor: pointer;" @click.stop="edit">
        <Edit />
      </el-icon>
    </div>
  </div>
</template>

<style scoped lang="scss">
.editor-btn-container {
  position: fixed;
  right: 0;
  top: 60vh;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: row-reverse;
  cursor: grab;

  .editor-btn-toggle {
    width: 30px;
    height: 60px;
    background-color: var(--el-color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    user-select: none;
    position: relative;
    border: none;

    /* 创建下坡效果的曲线边缘 */
    border-top-left-radius: 50% 20%;
    border-bottom-left-radius: 50% 20%;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: inherit;
      border-top-left-radius: 50% 20%;
      border-bottom-left-radius: 50% 20%;
      background: linear-gradient(120deg,
          rgba(255, 255, 255, 0.2) 0%,
          rgba(255, 255, 255, 0.05) 50%,
          transparent 100%);
      pointer-events: none;
    }

    &:active {
      cursor: grabbing;
    }

    &:hover {
      background-color: var(--el-color-primary-light-3);
    }

    .el-icon {
      transition: transform 0.3s ease;
      z-index: 1;
    }
  }

  &:active {
    cursor: grabbing;
  }
}

@media screen and (max-width: 768px) {
  .editor-btn-container {
    display: none;
  }
}
</style>
