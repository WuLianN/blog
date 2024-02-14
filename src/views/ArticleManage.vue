<template>
  <div class="article">
    <Table :data="list" :columns="columns" :width="tableWidth" :height="tableWidthHeight" @endReached="endReached" />

    <el-dialog title="编辑" v-model="dialogVisible" @close="dialogVisible = false" width="30%">
      <el-form label-width="80px" label-position="left">
        <el-form-item label="标题">
          <el-input v-model="editTitle" placeholder="请输入标题" clearable />
        </el-form-item>
        <el-form-item label="发布">
          <el-switch size="large" v-model="isPublish" inline-prompt active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
      </el-form>

      <TagsWrapper :originTags="originTags" :tags="tags" :dialogVisible="dialogVisible" @change="tagsChange" />

      <div class="btn-wrapper">
        <el-button type="primary" plain @click="goDrafts">修改</el-button>
      </div>

      <template #footer>
        <el-button plain @click="dialogVisible = false">取 消</el-button>
        <el-button plain type="primary" @click="submit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue';
import { getDraftList, deleteDraft, saveDraft } from '@/api/drafts';
import { getDraftTagList } from '@/api/tags'
import { useNavigateToNewTag } from '@/hooks/web/useNavigate'
import { bindTag2Draft, unbindTag2Draft } from '@/api/tags'
import { formatDate } from '@/utils/three_party'
import { ElTag, ElButton } from 'element-plus'; // 不引入ElTag ElText, 会丢样式。使用@ts-ignore 
import type { Column } from 'element-plus'

type CellRenderProps<T> = {
  cellData: T
  column: Column<T>
  columns: Column<T>[]
  columnIndex: number
  rowData: any
  rowIndex: number
}

const query = ref({
  page: 1,
  pageSize: 15,
  status: 0
});

const currentDraftId = ref<number>(0)
const editTitle = ref('')
const isPublish = ref(false)
const dialogVisible = ref(false)
const tags = ref<any[]>([])
const originTags = ref<any[]>([])
let newSelectedTags: any[] = [] // 选中的未创建的标签
let deleteSelectedTags: any[] = [] // 需要删除(解绑)的标签
const windowHeight = window.innerHeight
const tableWidth = ref(750)
const tableWidthHeight = ref(windowHeight)
const list = ref<any[]>([])
const columns = [
  {
    title: '时间',
    dataKey: 'create_time',
    // @ts-ignore
    cellRenderer: ({ cellData: create_time }: CellRenderProps<Date>) => <ElText>{formatDate(create_time)}</ElText>,
    align: "center",
    width: 150
  },
  {
    title: '标题',
    dataKey: 'title',
    // @ts-ignore
    cellRenderer: ({ cellData: title, rowData }: CellRenderProps<any>) => <ElLink onClick={() => jump(rowData)}>{title}</ElLink>
    ,
    align: "center",
    width: 150,
  },
  {
    title: '标签',
    dataKey: "tags",
    align: "center",
    cellRenderer: ({ cellData: tags }: CellRenderProps<any[]>) => tags && tags.map(item => <ElTag>{item.name}</ElTag>),
    width: 150,
  },
  {
    title: '状态',
    dataKey: 'is_publish',
    cellRenderer: ({ cellData: is_publish }: CellRenderProps<any>) => <ElTag type={is_publish ? 'success' : 'primary'}>{is_publish ? '已发布' : '草稿'}</ElTag>,
    align: "center",
    width: 150,
  },
  {
    title: '操作',
    dataKey: "operate",
    cellRenderer: ({ rowData }: CellRenderProps<any>) => (
      <>
        <ElButton size="small" onClick={() => edit(rowData.id)}>编辑</ElButton>
        <ElButton size="small" type="danger" onClick={() => del(rowData.id)}>
          删除
        </ElButton>
      </>
    ),
    align: "center",
    width: 150,
  }
]

getList()

async function getList() {
  const resultList: any[] = await getDraftList(query.value);

  if (resultList.length === 0) {
    ElMessage.warning("没有更多了！")
    return
  }

  list.value.push(...resultList)
}

async function edit(id: number) {
  dialogVisible.value = true

  const article = list.value.find(item => item.id === id)
  const { title, is_publish } = article

  currentDraftId.value = id
  editTitle.value = title
  isPublish.value = is_publish === 1 ? true : false

  tags.value = []
  originTags.value = []
  newSelectedTags = []
  deleteSelectedTags = []
  const tagList = await getTags(id)
  tags.value.push(...tagList)
  originTags.value.push(...tagList)
}

function del(id: number) {
  ElMessageBox.confirm('此操作将永久删除该文章, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteDraft(id)

      list.value.splice(list.value.findIndex(item => item.id === id), 1)

      ElMessage.success('删除成功!')
    } catch {
      ElMessage.error('删除失败!')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

async function getTags(id: number): Promise<any> {
  return await getDraftTagList({ draft_id: id })
}

async function submit() {
  if (!currentDraftId.value) {
    return
  }

  bindTags(currentDraftId.value) // 绑定标签
  unbindTags(currentDraftId.value) // 解绑标签

  const data = {
    id: currentDraftId.value,
    title: editTitle.value, // 标题
    is_publish: isPublish.value ? 1 : 0, // 是否发布
    operated_type: 1, // 
  }

  await saveDraft(data)

  sync() // 同步数据

  dialogVisible.value = false

  ElMessage.success('提交成功!')

  newSelectedTags = []
  deleteSelectedTags = []
}

function bindTags(draftId: number) {
  if (newSelectedTags.length > 0) {
    bindTag2Draft({
      draft_id: draftId,
      tags: newSelectedTags
    })
  }
}

function unbindTags(draftId: number) {
  if (deleteSelectedTags.length > 0) {
    unbindTag2Draft({
      draft_id: draftId,
      tags: deleteSelectedTags
    })
  }
}

function tagsChange(data: any) {
  const { newSelectedTags: newTagsList, oldSelectedTags: oldTagsList } = data
  newSelectedTags = newTagsList
  deleteSelectedTags = oldTagsList
}

function jump(rowData: any) {
  const { id } = rowData
  if (id) {
    useNavigateToNewTag(`/viewer/${id}`)
  }
}

function sync() {
  const currenRow = list.value.find(item => item.id === currentDraftId.value)
  currenRow.tags = tags.value
  currenRow.is_publish = isPublish.value ? 1 : 0
  currenRow.title = editTitle.value
}

function endReached() {
  query.value.page += 1
  getList()
}

function goDrafts() {
  currentDraftId.value && useNavigateToNewTag(`/drafts/${currentDraftId.value}`)
}
</script> 

<style scoped lang="scss">
.article {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}

:deep(.button-tag) {
  margin-left: 0 !important;
}

.btn-wrapper {
  margin-top: 18px;
}
</style>