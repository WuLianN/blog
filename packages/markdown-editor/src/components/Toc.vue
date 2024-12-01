<script setup lang="ts">
import { onUnmounted, reactive, ref, toRef, watch } from 'vue'

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

const contentRef = toRef(props, 'value')
watch(contentRef, (val) => {
  if (val) {
    collectItems() // 收集 h1-h6标题
    createIntersectionObserver() // 创建 IntersectionObserver
    observe() // 观察
  }
})

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

onUnmounted(() => {
  // 取消观察
  unObserve()
})
</script>

<template>
  <div v-if="items && items.length > 0" class="toc">
    <ul>
      <li
        v-for="(item, index) in items"
        :key="index"
        :style="{ paddingLeft: `${(item.level - minLevel) * 16 + 8}px` }"
        :title="item.text"
        :class="{ active: index === currentHeadingIndex }"
        @click="skipContent(index)"
      >
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
ul {
  list-style: none;
}

.active {
  color: var(--el-color-primary);
}

.toc {
  position: fixed;
  top: 100px;
  right: 100px;
  display: flex;
  flex-flow: column nowrap;
  padding: 8px 8px 8px 0;
  min-height: 200px;
  border: 1px solid var(--el-color-primary);
  border-radius: var(--el-border-radius-base);

  li {
    cursor: pointer;
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;

    &:not(:last-child) {
      padding-bottom: 8px;
    }
    &:hover {
      color: var(--el-color-primary-light-4);
    }
  }
}

@media screen and (max-width: 1400px) {
  .toc {
    display: none;
  }
}
</style>
