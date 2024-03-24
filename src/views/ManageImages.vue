<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { debounce } from 'lodash-es'
import { Search, Sort } from '@element-plus/icons-vue'
import { deleteUploadFiles, getUploadFileList } from '@/api/admin'
import type { GetUploadFileList } from '@/api/model/adminModel'
import loading from '@/assets/loading.png'
import error from '@/assets/error.png'

const list = ref<any[]>([])
const query = reactive({
  page: 1,
  page_size: 30,
  order: 'desc',
  keyword: '',
})
const debounceScrollFn = debounce(handleScroll, 300)
const dialogFormVisible = ref(false)

const loadProps = reactive({
  loading,
  error,
  ratioCalculator: (width: number, height: number) => {
    // 我设置了最小宽高比
    const minRatio = 3 / 4
    const maxRatio = 4 / 3
    // 获取当前图片的比例
    const curRatio = width / height
    // 如果当前图片比列不在此范围内，我们取最小或者最大值
    if (curRatio < minRatio)
      return minRatio
    else if (curRatio > maxRatio)
      return maxRatio
    else
      return curRatio
  },
})

const options = reactive({
  list,
  loadProps,
  rowKey: 'id',
  lazyload: true,
})

getList()

async function getList() {
  const result: GetUploadFileList[] = await getUploadFileList(query)
  if (result && result.length > 0) {
    result.forEach((item) => {
      item.src = item.access_url
    })
    list.value.push(...result)
  }

  if (result.length === 0 && query.page > 1)
    ElMessage.warning('没有更多了！')

  else if (result.length === 0 && query.page === 1)
    ElMessage.warning('没有数据！')
}

async function deleteItem(id: number) {
  const index = list.value.findIndex(item => item.id === id)

  if (index !== -1) {
    list.value.splice(index, 1)
    try {
      await deleteUploadFiles([id])
    }
    catch {
      ElMessage.error('删除失败！')
    }
  }
}

async function handleScroll() {
  const scrollTop = Math.floor(document.documentElement.scrollTop)
  const scrollHeight = Math.floor(document.documentElement.scrollHeight)
  const clientHeight = Math.floor(document.documentElement.clientHeight)

  // 检测是否滚动到距离底部60px
  if (scrollHeight - scrollTop <= clientHeight + 60) {
    query.page += 1

    getList()
  }
}

async function search() {
  dialogFormVisible.value = false
  resetQuery()
  getList()
}

async function sort() {
  if (query.order === 'asc')
    query.order = 'desc'
  else
    query.order = 'asc'

  query.page = 1
  list.value = []
  getList()
}

function resetQuery() {
  query.page = 1
  query.order = 'desc'
  list.value = []
}

onMounted(() => {
  // 监听滚动事件
  window.addEventListener('scroll', debounceScrollFn)
})

onUnmounted(() => {
  window.removeEventListener('scroll', debounceScrollFn)
})
</script>

<template>
  <div class="container">
    <WaterfallList :options="options" @delete="deleteItem" />

    <div class="operator">
      <el-button circle type="primary" @click.stop="dialogFormVisible = true">
        <el-icon>
          <Search />
        </el-icon>
      </el-button>
      <el-button circle type="success" @click.stop="sort">
        <el-icon>
          <Sort />
        </el-icon>
      </el-button>
    </div>

    <el-dialog v-model="dialogFormVisible" title="搜索" width="500">
      <el-form>
        <el-form-item label="图片名称" label-width="80">
          <el-input v-model="query.keyword" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button style="margin-right: 10px" @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="search">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
}

.operator {
  width: auto;
  height: 150px;
  padding: 0 10px;
  position: fixed;
  top: calc(50% - 75px);
  right: 50px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-evenly;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

:deep(.el-button + .el-button) {
  margin-left: 0 !important;
}
</style>
