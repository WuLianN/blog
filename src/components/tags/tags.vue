<script setup lang="ts">
import type { PropType } from 'vue'
import { nextTick, onUnmounted, reactive, ref, toRefs, watch } from 'vue'
import { ElInput } from 'element-plus'
import { Aim } from '@element-plus/icons-vue'
import { UseDraggable } from '@vueuse/components'
import { createTag, deleteTag, updateTag } from '@/api/tags'

const props = defineProps({
  tags: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  // 是否使用http上传数据
  isPost: {
    type: Boolean,
    default: true,
  },
  // dialogVisible 的状态来控制inputVisible
  dialogVisible: {
    type: Boolean,
    default: true,
  },
  editable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['selectedTags', 'click', 'update'])

const { tags, isPost, dialogVisible, editable } = toRefs(props)

const list = ref<any[]>([])

const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

const currentTag = reactive({
  id: 0,
  name: '',
  color: '',
  bg_color: '',
})
const visible = ref(false)
const isOpenSelector = ref(false)

const dialogWidth = ref('30%')
setDialogWidth()

watch(
  tags,
  (value) => {
    list.value = value
  },
  { immediate: true },
)

watch(
  dialogVisible,
  (val) => {
    if (val)
      inputVisible.value = false
    else inputVisible.value = true
  },
  { immediate: true },
)

function handleClose(tagId: number) {
  const index = list.value.findIndex(item => item.id === tagId)
  if (index !== -1) {
    list.value.splice(index, 1)
    // 上报 - 删除数据
    isPost.value && deleteTag({ id: tagId })

    // 返回标签数据给父组件
    exposeSelectedTags()
  }
}

function showInput() {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

async function handleInputConfirm(): Promise<void> {
  if (inputValue.value) {
    const isDuplicate = checkIsDuplicate(list.value, inputValue.value)

    if (isDuplicate) {
      inputValue.value = ''
      ElMessage.warning('标签已存在')
      return
    }

    list.value.push({ name: inputValue.value })
    inputVisible.value = false

    // 上报 - 添加数据
    if (isPost.value) {
      try {
        const { id } = await createTag({ name: inputValue.value })
        const found = list.value.find(item => item.name === inputValue.value)
        found && (found.id = id)
      }
      catch {
        list.value.pop()
      }
    }

    inputValue.value = ''

    // 返回标签数据给父组件
    exposeSelectedTags()
  }
}

function exposeSelectedTags() {
  emit('selectedTags', list.value)
}

function checkIsDuplicate(list: Array<any>, checkValue: string): boolean {
  const index = list.findIndex(item => item.name === checkValue)

  if (index !== -1) {
    // 有重复的
    return true
  }

  return false
}

function handleClick(tagInfo: any): void {
  if (!editable.value)
    return
  currentTag.id = tagInfo.id
  currentTag.name = tagInfo.name
  currentTag.color = tagInfo.color
  currentTag.bg_color = tagInfo.bg_color
  visible.value = true
}

async function submit() {
  if (!currentTag.name) {
    ElMessage.warning('请填写标签名')
    return
  }

  try {
    await updateTag({
      id: currentTag.id,
      name: currentTag.name,
      color: currentTag.color,
      bg_color: currentTag.bg_color,
    })
    ElMessage.success('修改成功')
    visible.value = false

    emit('update', currentTag)
  }
  catch {
    ElMessage.error('修改失败')
  }
}

function activeChangeBg(value: any) {
  currentTag.bg_color = value
}

function activeChangeText(value: any) {
  currentTag.color = value
}

function setDialogWidth() {
  const checkMedia = window.matchMedia(
    'only screen and (max-width: 1000px)',
  ).matches
  if (checkMedia)
    dialogWidth.value = '80%'
  else dialogWidth.value = '30%'
}

function selectorSelectedTag(tag: any) {
  const isExsit = list.value.some(item => item.id === tag.id)
  if (!isExsit) {
    list.value.push(tag)
    exposeSelectedTags()
  }
}

addEventListener('resize', setDialogWidth)

onUnmounted(() => {
  removeEventListener('resize', setDialogWidth)
})
</script>

<template>
  <div>
    <el-tag
      v-for="tag in list"
      :key="tag.id"
      size="large"
      closable
      :disable-transitions="false"
      :style="{ backgroundColor: tag.bg_color, color: tag.color }"
      @close="handleClose(tag.id)"
      @click="handleClick(tag)"
    >
      {{ tag.name }}
    </el-tag>

    <ElInput
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="input"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button v-else class="button-tag" @click="showInput">
      + 新标签
    </el-button>

    <el-button
      :icon="Aim"
      class="button-aim"
      @click="isOpenSelector = true"
    />
  </div>

  <el-dialog
    v-model="visible"
    title="编辑"
    :width="dialogWidth"
    @close="visible = false"
  >
    <el-form label-width="80px" label-position="left">
      <el-form-item label="预览">
        <el-tag
          class="dialog-tag"
          :style="{
            backgroundColor: currentTag.bg_color,
            color: currentTag.color,
          }"
          size="large"
        >
          {{ currentTag.name }}
        </el-tag>
      </el-form-item>

      <el-form-item label="标签名">
        <ElInput v-model="currentTag.name" />
      </el-form-item>

      <el-form-item label="背景颜色">
        <el-color-picker
          v-model="currentTag.bg_color"
          show-alpha
          @active-change="activeChangeBg"
        />
      </el-form-item>

      <el-form-item label="字体颜色">
        <el-color-picker
          v-model="currentTag.color"
          show-alpha
          @active-change="activeChangeText"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button plain @click="visible = false">
        取 消
      </el-button>
      <el-button plain type="primary" @click="submit">
        确 定
      </el-button>
    </template>
  </el-dialog>

  <UseDraggable
    v-if="isOpenSelector"
    :initial-value="{ x: 700, y: 15 }"
    style="position: fixed"
    storage-key="vueuse-draggable"
    storage-type="session"
  >
    <TagSelector
      @close="isOpenSelector = false"
      @selected-tag="selectorSelectedTag"
    />
  </UseDraggable>
</template>

<style scoped lang="scss">
$BtnWidth: 100px;
$BtnHeight: 32px;
$Margin: 10px;

:deep(.el-tag) {
  margin-bottom: $Margin;
  margin-right: $Margin;
}

:deep(.el-input) {
  margin-bottom: $Margin;
}

.button-tag {
  width: $BtnWidth;
  height: $BtnHeight;
  padding-top: 0;
  padding-bottom: 0;
  margin-bottom: 10px;
  margin-right: 10px;
}

.button-aim {
  margin-bottom: 10px;
  margin-left: 0;
}

.input {
  width: $BtnWidth;
  height: $BtnHeight;
  margin-right: 10px;
}

.dialog-tag-wrapper {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
}

.dialog-color-picker {
  margin-top: 10px;

  &-title {
    margin-right: 15px;
  }
}
</style>
