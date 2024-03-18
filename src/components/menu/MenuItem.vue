<template>
  <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.id.toString()">
    <template #title>
      <el-image class="image" v-if="item.meta && item.meta.icon" :src="item.meta && item.meta.icon" />
      <el-text type="primary" size="large">{{ item.name }}</el-text>
    </template>

    <!-- 组件自调 -->
    <menu-item v-for="(ele, index) in item.children" :item="ele" :key="index" />
  </el-sub-menu>

  <el-menu-item v-else :index="item.id.toString()" @click="getTagList(item)">

    <template #title>
      <el-image class="image" v-if="item.meta && item.meta.icon" :src="item.meta && item.meta.icon" />
      <el-text type="primary" size="large">{{ item.name }}</el-text>
    </template>
  </el-menu-item>
</template>

<script setup lang="ts">
import { getRecommendList } from '@/api/base'
import { useUserStore } from '@/store/modules/user'
import { useHomeStore } from '@/store/modules/home'
import { buildRecommendList } from '@/utils/blog'
import { PropType } from 'vue'
import { MenuItem as MenuItemType } from '@/api/model/menuModel'

const userStore = useUserStore()
const homeStore = useHomeStore()
const query = {
  userId: userStore.userInfo.id,
  tagIds: '',
  page: 1,
  pageSize: 10
}

defineProps({
  item: {
    type: Object as PropType<MenuItemType>,
    default: () => []
  }
})

defineOptions({
  name: 'menuItem'
})

async function getTagList(item: MenuItemType) {
  const { tags } = item

  if (tags && tags.length > 0) {
    query.tagIds = ''
    const tempList: any[] = []
    tags.forEach((ele: any) => {
      tempList.push(ele.id)
    })
    query.tagIds = tempList.toString()
  } else {
    ElMessage.error("当前分类暂未绑定标签")
    return
  }

  const list: any[] = await getRecommendList(query)

  if (list && list.length > 0) {
    const buildList = buildRecommendList(list)

    homeStore.setRecommendList(buildList)
  } else {
    ElMessage.warning("没有文章！")
  }
}
</script>

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