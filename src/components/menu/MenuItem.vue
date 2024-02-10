<template>
  <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.id">
    <template #title>
      <el-image class="image" v-if="item.meta && item.meta.icon" :src="item.meta && item.meta.icon" />
      <el-text type="primary">{{ item.name }}</el-text>
    </template>

    <!-- 组件自调 -->
    <menu-item v-for="(ele, index) in item.children" :item="ele" :key="ele.id" />
  </el-sub-menu>

  <el-menu-item v-else :index="item.id" @click="getTagList(item)">
    <template #title>
      <el-image class="image" v-if="item.meta && item.meta.icon" :src="item.meta && item.meta.icon" />
      <el-text type="primary">{{ item.name }}</el-text>
    </template>
  </el-menu-item>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getRecommendList } from '@/api/base'
import { useUserStore } from '@/store/modules/user'
import { useHomeStore } from '@/store/modules/home'
import { getExcerpt } from '@/utils/three_party'

const router = useRouter()
const userStore = useUserStore()
const homeStore = useHomeStore()
const query = {
  userId: userStore.user.id,
  tagId: null,
  page: 1,
  pageSize: 10
}

defineProps({
  item: {
    type: Object,
    default: () => []
  }
})

defineOptions({
  name: 'menuItem'
})


async function getTagList(item: any) {
  const { name, tags } = item

  if (tags && tags.length > 0) {
    const self = tags.find(i => i.name === name)
    if (self) {
      query.tagId = self.id
    } else {
      query.tagId = tags[0].id
    }
  } else {
    ElMessage.error("当前分类暂未绑定标签")
    return
  }

  const list = await getRecommendList(query)

  list.map(item => item.excerpt = getExcerpt(item.content))

  homeStore.setRecommendList(list)
}
</script>

<style scoped lang="scss">
.image {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
</style>