<template>
  <div class="menu">
    <div class="custom-tree-container">
      <el-tree :data="dataSource" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false"
        @nodeClick="nodeClick">
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-button plain type="primary" size="small" :icon="Plus" circle @click="append(data, $event)" />
              <el-button plain type="danger" size="small" :icon="Delete" circle @click="remove(node, data, $event)" />
            </span>
          </span>
        </template>

        <template #empty>
          <el-button plain type="primary" @click="appendTree">添加分类</el-button>
        </template>
      </el-tree>
    </div>

    <div v-if="dataSource.length > 0">
      <el-button plain type="primary" @click="appendTree">添加分类</el-button>
    </div>

    <div>
      <el-dialog v-model="dialogVisible" title="编辑" width="30%">
        <div>
          <el-input v-model="dialogCategoryName" placeholder="请输入分类名称" />
        </div>

        <TagsWrapper :originTags="originTags" :tags="tags" :dialogVisible="dialogVisible" @change="tagsChange" />

        <div class="upload-container">
          <avatar-upload :width="64" :height="64" @change="handleImageChange" :imgUrl="imgUrl" />
        </div>

        <template #footer>
          <el-button plain @click="dialogVisible = false">取 消</el-button>
          <el-button plain type="primary" @click="dialogSubmit">确 定</el-button>
        </template>

      </el-dialog>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import {
  Plus,
  Delete,
} from '@element-plus/icons-vue'
import { getMenuList } from '@/api/menu'
import { getMenuTagList, bindTag2Menu, unbindTag2Menu } from '@/api/tags'
import { addMenuItem, deleteMenuItem, updateMenuItem } from '@/api/menu'

interface Tree {
  id: number
  label: string
  children?: Tree[]
}

let id = 1000

const dialogVisible = ref(false)
const dialogCategoryName = ref('')

const tags = ref([])
const currentNode = ref('')
const currentTreeNode = ref('')
const dataSource = ref<Tree[]>([])
let newSelectedTags = [] // 选中的未创建的标签
let deleteSelectedTags = [] // 需要删除(解绑)的标签
const originTags = ref([]) // 原有的标签
const imgUrl = ref('')

getTreeList()

const append = (data: Tree, event: Event) => {
  event.stopPropagation()

  const newChild = { id: id++, label: '标题', children: [] }
  if (!data.children) {
    data.children = []
  }
  data.children.push(newChild)
  dataSource.value = [...dataSource.value]
}

const remove = async (node: Node, data: Tree, event: Event) => {
  event.stopPropagation()

  const parent = node.parent
  const children: Tree[] = parent.data.children || parent.data
  const index = children.findIndex((d) => d.id === data.id)
  children.splice(index, 1)
  dataSource.value = [...dataSource.value]

  await deleteMenuItem(data.id)
}

function appendTree() {
  const node = {
    id: id++,
    label: '分类' + String(id).slice(3),
    children: []
  }
  dataSource.value.push(node)
}

async function getTreeList() {
  const result = await getMenuList()

  if (result) {
    dataSource.value = [...result]
  }
}

async function nodeClick(node, treeNode) {
  dialogVisible.value = true

  dialogCategoryName.value = node.label

  tags.value = []
  originTags.value = []
  newSelectedTags = []
  deleteSelectedTags = []

  const tagList = await getTags(node.id)

  tags.value.push(...tagList)
  originTags.value.push(...tagList)

  currentNode.value = node
  currentTreeNode.value = treeNode

  imgUrl.value = node?.meta?.icon
}

async function getTags(id): Array<any> {
  return await getMenuTagList({ menu_id: id })
}

async function dialogSubmit() {
  const checkStatus = check()
  if (!checkStatus) {
    return
  }
  const { id: currentNodeId, parent_id: currentParentId } = currentNode.value // 点击的当前节点 +添加的节点没有parent_id 注：parent_id=0为一级节点
  const level1Node = getLevel_1_Node(currentTreeNode.value) // level1节点 也就是当前节点的根节点
  const { category_id: categoryId } = level1Node
  const { level: currentTreeNodeLevel } = currentTreeNode.value

  const ids = getIds(currentTreeNode.value, currentTreeNodeLevel).reverse() // 1 -> 2 -> 3

  // 当前节点的父节点id 用于绑定父-子关系 存储于数据库的id
  let parentId = 0

  if (currentParentId || currentParentId === 0) {
    parentId = currentParentId
  } else {
    if (currentTreeNode.value.parent.level === 0) {
      parentId = 0
    } else {
      parentId = currentTreeNode.value.parent.data.id
    }
  }

  const data = {
    name: dialogCategoryName.value,
    parent_id: parentId,
    category_id: categoryId,
    icon: imgUrl.value,
    id: currentNodeId
  }

  // 存在currentParentId，说明是已存在的分类
  if (currentParentId || currentParentId === 0) {
    // 更新
    // 同步标签
    syncMenu(dataSource.value, ids)

    await updateMenuItem(data)
  } else {
    // 新增
    const menuItem = await addMenuItem(data)
    // 同步标签、后端返回的id
    syncMenu(dataSource.value, ids, menuItem)
  }

  // 解绑标签
  if (deleteSelectedTags.length > 0) {
    unbindTag2Menu({
      menu_id: currentNodeId,
      tags: deleteSelectedTags
    })
  }

  // 绑定标签
  if (newSelectedTags.length > 0) {
    bindTag2Menu({
      menu_id: currentNode.value.id, // 去拿syncMenu同步后的菜单id。注意：不要用上边解构的currentNodeId，已丢失绑定。
      tags: newSelectedTags
    })
  }

  dialogVisible.value = false
  dialogCategoryName.value = ''

  newSelectedTags = []
  deleteSelectedTags = []
}

function tagsChange(data) {
  const { newSelectedTags: newTagsList, oldSelectedTags: oldTagsList } = data
  newSelectedTags = newTagsList
  deleteSelectedTags = oldTagsList
}

function getLevel_1_Node(node) {
  if (node.level !== 1) {
    return getLevel_1_Node(node.parent)
  }
  return node
}

function getNodeByLevel(node, level) {
  if (node.level === level) {
    return node
  } else {
    return getNodeByLevel(node.parent, level)
  }
}

// 3 -> 2 -> 1
function getIds(treeNode, level): Array<number> {
  const ids = []
  for (let i = level; i <= level && i > 0; i--) {
    const node = getNodeByLevel(treeNode, i)
    const id = node.data.id
    ids.push(id)
  }
  return ids
}

// 同步菜单
function syncMenu(list, ids, menuItem) {
  const node = list.find(item => ids.includes(item.id))
  if (node) {
    const length = ids.length
    if (ids[length - 1] === node.id) {
      node.label = dialogCategoryName.value

      // 更换为后端返回的id, 方便给当前分类添加额外功能
      if (menuItem?.id >= 0) {
        node.id = menuItem.id
      }
      if (menuItem?.parent_id >= 0) {
        node.parent_id = menuItem.parent_id
      }
    }
    return syncMenu(node.children, ids, menuItem)
  }

  return
}

function check() {
  const { level, parent } = currentTreeNode.value
  const { parent_id: parentId } = parent.data

  // level > 1, 不是初始的父级节点
  if (level > 1 && parentId === undefined) {
    dialogVisible.value = false
    createMessage.error('请先创建父级分类')
    return false
  }

  return true
}

function handleImageChange(url) {
  imgUrl.value = url
}
</script>

<style scoped>
.custom-tree-container {
  width: 500px;
  padding-bottom: 20px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.menu {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
}

:deep(.el-tree-node__content) {
  margin-bottom: 10px;
}

.tags-container {
  margin-top: 20px;
}

:deep(.button-tag,
  .el-input) {
  margin-left: 0 !important;
}

:deep(.el-tag+.button-tag,
  .el-tag+.el-input) {
  margin-left: 10px !important;
}

.upload-container {
  margin-top: 20px;
}
</style>
