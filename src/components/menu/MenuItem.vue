<script setup lang="ts">
import type { PropType } from 'vue'
import { getRecommendList } from '@/api/base'
import { useUserStore } from '@/store/modules/user'
import { useHomeStore } from '@/store/modules/home'
import { buildRecommendList } from '@/utils/blog'
import type { MenuItem as MenuItemType } from '@/api/model/menuModel'

defineOptions({
  name: 'MenuItem',
})
defineProps({
  item: {
    type: Object as PropType<MenuItemType>,
    default: () => {},
  },
})
const userStore = useUserStore()
const homeStore = useHomeStore()
const query = {
  userId: userStore.userInfo.id,
  tagIds: '',
  page: 1,
  pageSize: 10,
}

async function getTagList(item: MenuItemType) {
  const { tags } = item

  if (tags && tags.length > 0) {
    query.tagIds = ''
    const tempList: any[] = []
    tags.forEach((ele: any) => {
      tempList.push(ele.id)
    })
    query.tagIds = tempList.toString()
    homeStore.setTagIds(query.tagIds)
  }
  else {
    ElMessage.error('当前分类暂未绑定标签')
    return
  }

  const list: any[] = await getRecommendList(query)

  if (list && list.length > 0) {
    const buildList = buildRecommendList(list)

    homeStore.setRecommendList(buildList)
  }
  else {
    ElMessage.warning('没有文章！')
  }
}
</script>

<template>
  <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.id.toString()">
    <template #title>
      <el-image v-if="item.meta && item.meta.icon" class="image" :src="item.meta && item.meta.icon" />
      <el-text type="primary" size="large">
        {{ item.name }}
      </el-text>
    </template>

    <!-- 组件自调 -->
    <menu-item v-for="(ele, index) in item.children" :key="index" :item="ele" />
  </el-sub-menu>

  <el-menu-item v-else :index="item.id.toString()" @click="getTagList(item)">
    <template #title>
      <el-image v-if="item.meta && item.meta.icon" class="image" :src="item.meta && item.meta.icon" />
      <el-text type="primary" size="large">
        {{ item.name }}
      </el-text>
    </template>
  </el-menu-item>
</template>

<style scoped lang="scss">
.image {
  position: relative;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
