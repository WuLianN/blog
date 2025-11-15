<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, toRef, watch } from 'vue'
import { Memo } from '@element-plus/icons-vue'
import { throttle } from 'lodash-es'

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
})

const minLevel = ref(6)
const items = reactive<any[]>([])
const currentHeadingIndex = ref(0)
let observer: IntersectionObserver

// 锚点导航显示状态
const isTocVisible = ref(true)

// 锚点位置
const tocTop = ref(0)

// 初始化TOC位置
function initTocPosition() {
  // 从本地存储获取位置信息
  const savedPosition = localStorage.getItem('tocPosition')
  if (savedPosition) {
    try {
      const position = JSON.parse(savedPosition)
      // 检查是否为有效的数字
      if (typeof position === 'number' && !Number.isNaN(position)) {
        tocTop.value = position
      }
      else {
        // 如果存储的位置无效，则使用默认位置
        tocTop.value = window.innerHeight / 3
      }
    }
    catch {
      // 解析失败时使用默认位置
      tocTop.value = window.innerHeight / 3
    }
  }
  else {
    // 没有存储位置时使用默认位置
    tocTop.value = window.innerHeight / 3
  }

  // 确保TOC不会超出窗口范围
  validatePosition()
}

// 验证并调整位置确保在有效范围内
function validatePosition() {
  const minHeight = 100
  const maxHeight = window.innerHeight - 100
  tocTop.value = Math.max(minHeight, Math.min(maxHeight, tocTop.value))
}

// 锚点自动隐藏定时器
let tocAutoHideTimer: number | null = null

// 拖动相关变量
const isDragging = ref(false)
const dragStartY = ref(0)
const dragStartTop = ref(0)

const contentRef = toRef(props, 'value')
watch(contentRef, (val) => {
  if (val) {
    collectItems() // 收集 h1-h6标题
    createIntersectionObserver() // 创建 IntersectionObserver
    observe() // 观察
  }
})

// 限制文本长度的函数
function limitTextLength(text: string, maxLength: number = 20): string {
  if (!text)
    return ''
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}

function showToc() {
  isTocVisible.value = true

  // 清除之前的定时器
  if (tocAutoHideTimer) {
    clearTimeout(tocAutoHideTimer)
    tocAutoHideTimer = null
  }
}

function hideToc() {
  isTocVisible.value = false
}

// 鼠标进入处理
function handleMouseEnter() {
  showToc()
}

// 鼠标离开处理
function handleMouseLeave() {
  // 设置定时器，1秒后自动隐藏
  tocAutoHideTimer = window.setTimeout(() => {
    hideToc()
  }, 1000)
}

// 开始拖动
function startDrag(e: MouseEvent) {
  isDragging.value = true
  dragStartY.value = e.clientY
  dragStartTop.value = tocTop.value

  // 添加全局事件监听器
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)

  // 防止文本选择
  e.preventDefault()
}

// 停止拖动
function stopDrag() {
  isDragging.value = false

  // 保存位置到本地存储
  savePosition()

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

  tocTop.value = newTop
}

// 保存位置到本地存储
function savePosition() {
  localStorage.setItem('tocPosition', JSON.stringify(tocTop.value))
}

// 滚动事件处理函数
const handleScroll = throttle(() => {
  showToc()

  // 设置定时器，1秒后自动隐藏
  if (tocAutoHideTimer) {
    clearTimeout(tocAutoHideTimer)
  }

  tocAutoHideTimer = window.setTimeout(() => {
    // 只有当鼠标不在目录上时才隐藏
    const tocElement = document.querySelector('.toc-container')
    if (tocElement && !tocElement.matches(':hover')) {
      hideToc()
    }
  }, 1000)
}, 300)

function skipContent(index: number) {
  const root = document.querySelector('.markdown-body') as HTMLElement
  const headings = root.querySelectorAll('h1,h2,h3,h4,h5,h6')
  setCurrentHeadingIndex(index)
  headings[index].scrollIntoView()
}

function setCurrentHeadingIndex(index: number) {
  currentHeadingIndex.value = index
}

function collectItems() {
  let _minLevel = minLevel.value

  const root: HTMLElement = document.querySelector(
    '.markdown-body',
  ) as HTMLElement

  // root.children is HTMLCollection
  Array.prototype.filter
    .call(root.children, v => v && v.nodeType === 1)
    .forEach((node) => {
      if (node.tagName[0].toLowerCase() === 'h' && node.hasChildNodes()) {
        const i = Number(node.tagName[1]) // h1 h2 h3 h4 h5 h6
        _minLevel = Math.min(_minLevel, i)
        items.push({
          level: i,
          text: node.textContent, // stringifyHeading(node),
        })
      }
    })

  minLevel.value = _minLevel
}

function createIntersectionObserver() {
  const root = document.querySelector('.markdown-body') as HTMLElement
  const headings = root.querySelectorAll('h1,h2,h3,h4,h5,h6')

  observer = new IntersectionObserver(
    (entries) => {
      const io = entries[0]
      if (io.isIntersecting === true) {
        const index = Array.prototype.indexOf.call(headings, io.target)
        if (index !== -1) {
          setCurrentHeadingIndex(index)
        }
      }
    },
    { threshold: [1] },
  )
}

function observe() {
  const root = document.querySelector('.markdown-body') as HTMLElement
  const headings = root.querySelectorAll('h1,h2,h3,h4,h5,h6')

  // observe all head
  headings.forEach((node) => {
    observer?.observe(node)
  })
}

function unObserve() {
  const root = document.querySelector('.markdown-body') as HTMLElement
  const headings = root.querySelectorAll('h1,h2,h3,h4,h5,h6')
  headings.forEach((node) => {
    observer?.unobserve(node)
  })
}

// 监听窗口大小变化
function handleResize() {
  // 重新验证位置
  validatePosition()
  // 保存新位置
  savePosition()
}

// 组件挂载时添加事件监听器
onMounted(() => {
  initTocPosition()
  // 添加窗口大小变化监听器
  window.addEventListener('resize', handleResize)

  // 添加滚动事件监听器
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  // 取消观察
  unObserve()

  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)

  // 清除定时器
  if (tocAutoHideTimer) {
    clearTimeout(tocAutoHideTimer)
  }
})
</script>

<template>
  <div
    v-if="items && items.length > 0"
    class="toc-container"
    :style="{ top: `${tocTop}px` }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      class="toc-toggle-btn"
      @mousedown="startDrag"
    >
      <el-icon size="20" color="white">
        <Memo />
      </el-icon>
    </div>
    <div
      class="toc"
      :class="{ visible: isTocVisible }"
    >
      <div class="toc-title">
        目录
      </div>
      <ul>
        <li
          v-for="(item, index) in items"
          :key="index"
          :style="{ paddingLeft: `${(item.level - minLevel) * 16 + (index === currentHeadingIndex ? 12 : 0)}px` }"
          :title="item.text"
          :class="{ active: index === currentHeadingIndex }"
          @click="skipContent(index)"
        >
          {{ limitTextLength(item.text, 25) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.toc-container {
  position: fixed;
  right: 0;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: row-reverse;

  .toc-toggle-btn {
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
      background: linear-gradient(
        120deg,
        rgba(255, 255, 255, 0.2) 0%,
        rgba(255, 255, 255, 0.05) 50%,
        transparent 100%
      );
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

  .toc {
    background-color: white;
    border-radius: 8px 0 0 8px;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
    padding: 15px 10px;
    min-width: 150px;
    opacity: 0;
    visibility: hidden;
    transform: translateX(100%);
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    margin-right: -30px;
    max-height: 70vh;
    overflow-y: auto;

    @at-root html.dark & {
      background-color: var(--el-bg-color-overlay);
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.3);
    }

    &.visible {
      opacity: 1;
      visibility: visible;
      transform: translateX(0);
      margin-right: 0;
    }

    .toc-title {
      font-size: 16px;
      font-weight: bold;
      padding: 0 10px 10px;
      border-bottom: 1px solid #eee;
      margin-bottom: 10px;
      color: var(--el-text-color-primary);

      @at-root html.dark & {
        border-bottom: 1px solid var(--el-border-color);
      }
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        cursor: pointer;
        width: 100%;
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        padding: 8px 10px;
        border-radius: 4px;
        margin-bottom: 5px;
        color: var(--el-text-color-primary);
        transition: all 0.2s ease;
        line-height: 1.5;
        position: relative;

        // 为不同级别的标题添加不同的样式
        &[style*="padding-left: 0px"] {
          font-weight: 600;
          font-size: 14px;
        }

        &[style*="padding-left: 16px"] {
          font-weight: 500;
          font-size: 13.5px;
        }

        &[style*="padding-left: 32px"] {
          font-size: 13px;
        }

        &[style*="padding-left: 48px"] {
          font-size: 12.5px;
        }

        &[style*="padding-left: 64px"] {
          font-size: 12px;
        }

        &[style*="padding-left: 80px"] {
          font-size: 11.5px;
        }

        &:not(:last-child) {
          margin-bottom: 2px;
        }

        &:hover {
          background-color: var(--el-color-primary-light-8);

          @at-root html.dark & {
            background-color: var(--el-color-primary-light-3);
          }
        }

        &.active {
          color: var(--el-color-primary);
          background-color: var(--el-color-primary-light-9);
          font-weight: 500;

          @at-root html.dark & {
            background-color: var(--el-color-primary-dark-8);
          }

          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 2px;
            background-color: var(--el-color-primary);
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .toc-container {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  .toc {
    pointer-events: none !important;
  }
}
</style>
