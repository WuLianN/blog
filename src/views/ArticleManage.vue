<script setup lang="tsx">
import { onMounted, onUnmounted, ref } from 'vue'
import { TableV2SortOrder } from 'element-plus'
import type { Column, SortBy } from 'element-plus'
import { Filter, Search } from '@element-plus/icons-vue'
import { deleteDraft, getDraftList, saveDraft } from '@/api/drafts'
import { bindTag2Draft, getDraftTagList, getTagList, unbindTag2Draft } from '@/api/tags'
import { useNavigateToNewTag } from '@/hooks/web/useNavigate'
import { compareFn } from '@/utils/utils'
import { formatDate } from '@/utils/three_party'
import type { Tag } from '@/api/model/tagsModel'

interface CellRenderProps<T> {
  cellData: T
  column: Column<T>
  columns: Column<T>[]
  columnIndex: number
  rowData: any
  rowIndex: number
}

interface HeaderRenderProps<T> {
  column: Column<T>
  columns: Column<T>[]
  columnIndex: number
  headerIndex: number
}

// jsx 未找到的类型错误
declare const ElLink: any
declare const ElRow: any
declare const ElInput: any
declare const ElButton: any
declare const ElCol: any
declare const ElIcon: any
declare const ElPopover: any
declare const ElTag: any
declare const ElText: any
declare const ElSelect: any
declare const ElOption: any

const query = ref({
  page: 1,
  pageSize: 15,
  status: 0,
  title: '',
  tagIds: '',
})
let tagsSelector: any[] = []
const currentDraftId = ref<number>(0)
const editTitle = ref('')
const isPublish = ref(false)
const isPrivacy = ref(false)
const dialogVisible = ref(false)
const tags = ref<any[]>([])
const originTags = ref<any[]>([])
let newSelectedTags: any[] = [] // 选中的未创建的标签
let deleteSelectedTags: any[] = [] // 需要删除(解绑)的标签
const windowHeight = window.innerHeight
const tableWidth = ref(930)
const tableWidthHeight = ref(windowHeight)
const list = ref<any[]>([])
const draftStatusOptions = [
  {
    label: '全部',
    value: 0,
  },
  {
    label: '已发布',
    value: 1,
  },
  {
    label: '草稿',
    value: 2,
  },
  {
    label: '私密',
    value: 3,
  },
]
const columns = [
  {
    title: '时间',
    dataKey: 'create_time',
    cellRenderer: ({ cellData: create_time }: CellRenderProps<Date>) => (
      <ElText>{formatDate(create_time)}</ElText>
    ),
    align: 'center',
    width: 180,
    key: 'create_time',
    sortable: true,
  },
  {
    title: '标题',
    dataKey: 'title',
    cellRenderer: ({ cellData: title, rowData }: CellRenderProps<any>) => (
      <ElLink title={title} underline="hover" onClick={() => jump(rowData)}>
        {title}
      </ElLink>
    ),
    headerCellRenderer: ({ column }: HeaderRenderProps<any>) => (
      <ElRow style="width: 300px;" align="middle" gutter={2}>
        <ElCol span={3}>{column.title}</ElCol>
        <ElCol span={19} style="display: flex;">
          <ElPopover placement="bottom">
            {{
              reference: () => (
                <ElIcon>
                  <Search />
                </ElIcon>
              ),
              default: () => (
                <ElInput
                  v-model={query.value.title}
                  placeholder="请输入标题"
                  clearable
                  onKeyup={(e: any) => {
                    if (e.keyCode === 13) {
                      getList('search')
                    }
                  }}
                />
              ),
            }}
          </ElPopover>
        </ElCol>
      </ElRow>
    ),
    align: 'left',
    width: 300,
    key: 'title',
  },
  {
    title: '标签',
    dataKey: 'tags',
    align: 'left',
    cellRenderer: ({ cellData: tags }: CellRenderProps<any[]>) =>
      tags
      && tags?.map((item: Tag) => (
        <ElTag style={{ backgroundColor: item.bg_color, color: item.color }}>
          {item.name}
        </ElTag>
      )),
    headerCellRenderer: ({ column }: HeaderRenderProps<any>) => (
      <ElRow style="width: 150px;" align="middle" gutter={2}>
        <ElCol span={6}>{column.title}</ElCol>
        <ElCol span={16} style="display: flex;">
          <ElPopover placement="bottom" onShow={getTagsSelector} width="200">
            {{
              reference: () => (
                <ElIcon>
                  <Filter />
                </ElIcon>
              ),
              default: () => (
                <ElSelect
                  v-model={query.value.tagIds}
                  collapse-tags
                  collapse-tags-tooltip
                  filterable
                  multiple
                  onChange={() => tagsSelectorChange()}
                  teleported={false}
                >
                  {tagsSelector.map(item => (
                    <ElOption
                      key={item.id}
                      label={item.name}
                      value={item.id}
                    />
                  ))}
                </ElSelect>
              ),
            }}
          </ElPopover>
        </ElCol>
      </ElRow>
    ),
    width: 150,
    key: 'tags',
    class: 'tags-container',
  },
  {
    title: '状态',
    dataKey: 'is_publish',
    cellRenderer: ({ cellData: is_publish, rowData }: CellRenderProps<any>) => (
      <>
        <ElTag type={is_publish ? 'success' : 'primary'}>
          {is_publish ? '已发布' : '草稿'}
        </ElTag>
        {rowData.is_privacy === 1 && <ElTag type="danger">私密</ElTag>}
      </>
    ),
    headerCellRenderer: ({ column }: HeaderRenderProps<any>) => (
      <ElRow style="width: 150px;" align="middle" gutter={2}>
        <ElCol span={6}>{column.title}</ElCol>
        <ElCol span={16} style="display: flex;">
          <ElPopover placement="bottom">
            {{
              reference: () => (
                <ElIcon>
                  <Filter />
                </ElIcon>
              ),
              default: () => (
                <ElSelect
                  v-model={query.value.status}
                  collapse-tags
                  collapse-tags-tooltip
                  onChange={() => draftStatusChange()}
                  teleported={false}
                >
                  {draftStatusOptions.map(item => (
                    <ElOption
                      key={item.value}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </ElSelect>
              ),
            }}
          </ElPopover>
        </ElCol>
      </ElRow>
    ),
    align: 'left',
    width: 150,
    key: 'is_publish',
  },
  {
    title: '操作',
    dataKey: 'operate',
    cellRenderer: ({ rowData }: CellRenderProps<any>) => (
      <>
        <ElButton size="small" onClick={() => edit(rowData.id)}>
          编辑
        </ElButton>
        <ElButton size="small" type="danger" onClick={() => del(rowData.id)}>
          删除
        </ElButton>
      </>
    ),
    align: 'center',
    width: 150,
    key: 'operate',
  },
]

const sortState = ref<SortBy>()

const bgImage = ref('')

const dialogWidth = ref('30%')
setDialogWidth()

getList()

async function getList(mode: string | void = '') {
  if (mode === 'search') {
    query.value.page = 1
    list.value = []
  }
  const resultList: any[] = await getDraftList(query.value)

  if (resultList.length === 0 && query.value.page > 1) {
    ElMessage.warning('没有更多了！')
    return
  }
  else if (resultList.length === 0 && query.value.page === 1) {
    ElMessage.warning('没有数据！')
    return
  }

  list.value.push(...resultList)
}

async function edit(id: number) {
  dialogVisible.value = true

  const article = list.value.find(item => item.id === id)
  const { title, is_publish, is_privacy, bg_image } = article

  currentDraftId.value = id
  editTitle.value = title
  isPublish.value = is_publish === 1
  isPrivacy.value = is_privacy === 1
  bgImage.value = bg_image

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
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteDraft(id)

        list.value.splice(
          list.value.findIndex(item => item.id === id),
          1,
        )

        ElMessage.success('删除成功!')
      }
      catch {
        ElMessage.error('删除失败!')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

async function getTags(id: number): Promise<any> {
  return await getDraftTagList({ draft_id: id })
}

async function getTagsSelector() {
  if (tagsSelector.length === 0) {
    const list = await getTagList()
    if (list && list.length > 0) {
      tagsSelector = list
    }
  }
}

async function submit() {
  if (!currentDraftId.value)
    return

  bindTags(currentDraftId.value) // 绑定标签
  unbindTags(currentDraftId.value) // 解绑标签

  const data = {
    id: currentDraftId.value,
    title: editTitle.value, // 标题
    is_publish: isPublish.value ? 1 : 0, // 是否发布
    is_privacy: isPrivacy.value ? 1 : 0, // 是否私密
    operated_type: 1, //
    bg_image: bgImage.value, // 背景图
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
      tags: newSelectedTags,
    })
  }
}

function unbindTags(draftId: number) {
  if (deleteSelectedTags.length > 0) {
    unbindTag2Draft({
      draft_id: draftId,
      tags: deleteSelectedTags,
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
  if (id)
    useNavigateToNewTag(`/viewer/${id}`)
}

function sync() {
  const currenRow = list.value.find(item => item.id === currentDraftId.value)
  currenRow.tags = tags.value
  currenRow.is_publish = isPublish.value ? 1 : 0
  currenRow.is_privacy = isPrivacy.value ? 1 : 0
  currenRow.title = editTitle.value
}

function endReached() {
  query.value.page += 1
  getList()
}

function goDrafts() {
  currentDraftId.value
  && useNavigateToNewTag(`/drafts/${currentDraftId.value}`)
}

function handleImageChange(url: string) {
  bgImage.value = url
}

function setDialogWidth() {
  const checkMedia = window.matchMedia(
    'only screen and (max-width: 1000px)',
  ).matches
  if (checkMedia)
    dialogWidth.value = '80%'
  else dialogWidth.value = '30%'
}

function onSort(sortBy: SortBy) {
  if (!sortBy.order)
    sortBy.order = TableV2SortOrder.DESC

  sortState.value = sortBy

  if (sortBy.key === 'create_time') {
    if (sortBy.order === TableV2SortOrder.ASC) {
      list.value = list.value.sort((a, b) =>
        compareFn(a, b, sortBy.key as string, true),
      )
    }
    else {
      list.value = list.value.sort((a, b) =>
        compareFn(a, b, sortBy.key as string, false),
      )
    }
  }
}

function tagsSelectorChange() {
  getList('search')
}

function draftStatusChange() {
  getList('search')
}

onMounted(() => {
  addEventListener('resize', setDialogWidth)
})

onUnmounted(() => {
  removeEventListener('resize', setDialogWidth)
})
</script>

<template>
  <div class="article">
    <Table
      :sort-by="sortState"
      :data="list"
      :columns="columns"
      :width="tableWidth"
      :height="tableWidthHeight"
      fixed
      @column-sort="onSort"
      @end-reached="endReached"
    />

    <el-dialog
      v-model="dialogVisible"
      title="编辑"
      :width="dialogWidth"
      @close="dialogVisible = false"
    >
      <el-form label-width="80px" label-position="left">
        <el-form-item label="标题">
          <ElInput v-model="editTitle" placeholder="请输入标题" clearable />
        </el-form-item>
        <el-form-item label="发布">
          <el-switch
            v-model="isPublish"
            size="large"
            inline-prompt
            active-text="是"
            inactive-text="否"
          />
        </el-form-item>
        <el-form-item label="私密">
          <el-switch
            v-model="isPrivacy"
            size="large"
            inline-prompt
            active-text="是"
            inactive-text="否"
          />
        </el-form-item>
        <el-form-item label="背景图">
          <avatar-upload
            :width="128"
            :height="128"
            :img-url="bgImage"
            @change="handleImageChange"
          />
        </el-form-item>
      </el-form>

      <TagsWrapper
        :has-aim="true"
        :is-post="false"
        :origin-tags="originTags"
        :tags="tags"
        :dialog-visible="dialogVisible"
        @change="tagsChange"
      />

      <div class="btn-wrapper">
        <ElButton type="primary" plain @click="goDrafts">
          修改文章
        </ElButton>
      </div>

      <template #footer>
        <ElButton plain @click="dialogVisible = false">
          取 消
        </ElButton>
        <ElButton plain type="primary" @click="submit">
          确 定
        </ElButton>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.article {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}

:deep(.tags-container) {
  overflow: auto !important;

  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--el-color-primary-light-8);
  }
}

:deep(.button-tag) {
  margin-left: 0 !important;
}

.btn-wrapper {
  margin-top: 18px;
}

:deep(.el-link__inner) {
  width: 100%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-content: flex-start;
}

:deep(.el-link) {
  width: 100%;
}

:deep(.el-tag) {
  border-color: transparent !important;
}

:deep(.tags-container .el-input:first-child) {
  margin-left: 0 !important;
}
</style>
