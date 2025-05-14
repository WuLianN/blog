<script setup lang="ts">
import { reactive } from 'vue'
import { CircleClose, Search } from '@element-plus/icons-vue'
import { getTagList, searchTags } from '@/api/tags'
import { findUserId } from '@/utils/blog'

const emits = defineEmits(['close', 'selectedTag'])
const tagList = reactive<any[]>([])
let originTagList = reactive<any[]>([]) // 缓存原始数据
const query = reactive({
  tagName: '',
})
getList()

async function getList(ids: string = '') {
  const list: any[] = await getTagList({ ids })
  tagList.push(...list)

  originTagList = JSON.parse(JSON.stringify(tagList))
}

async function tagClick(tag: any) {
  tag.isNew = true
  emits('selectedTag', tag)
}

async function searchTag(wd: string | number) {
  const userId = findUserId()

  if (wd && userId) {
    const data = {
      user_id: userId,
      name: wd,
    }
    const res = await searchTags(data)
    if (res) {
      tagList.splice(0, tagList.length, ...res)
    }
  }
  if (!wd) {
    tagList.splice(0, tagList.length, ...originTagList)
  }
}
</script>

<template>
  <div class="selector">
    <div class="selector-close">
      <el-icon size="24" @click="emits('close')">
        <CircleClose />
      </el-icon>
    </div>
    <div>
      <el-input
        v-model="query.tagName"
        placeholder="请输入标签名"
        :clearable="true"
        :prefix-icon="Search"
        @clear="searchTag('')"
        @blur="searchTag(query.tagName)"
        @keyup.enter="searchTag(query.tagName)"
      />
    </div>
    <TagList :list="tagList" @click="tagClick" />
  </div>
</template>

<style scoped lang="scss">
.selector {
  width: 300px;
  height: auto;
  background-color: #fff;
  z-index: 1;
  padding: 15px;
  border-radius: var(--el-dialog-border-radius);

  &-close {
    width: 100%;
    height: auto;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 15px;

    .el-icon {
      cursor: pointer;
    }
  }
}
</style>
