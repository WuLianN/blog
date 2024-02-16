<template>
  <div>
    <el-tag v-for="tag in list" :key="tag.id" size="large" closable :disable-transitions="false"
      @close="handleClose(tag.id)" @click="handleClick(tag)" :style="{ backgroundColor: tag.bg_color, color: tag.color }">
      {{ tag.name }}
    </el-tag>

    <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="input" @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm" />
    <el-button v-else class="button-tag" @click="showInput">
      + 新标签
    </el-button>
  </div>

  <el-dialog title="编辑" v-model="visible" @close="visible = false" width="30%">
    <el-form label-width="80px" label-position="left">
      <el-form-item label="预览">
        <el-tag class="dialog-tag" :style="{ backgroundColor: currentTag.bg_color, color: currentTag.color }" size="large">{{ currentTag.name }}</el-tag>
      </el-form-item>

      <el-form-item label="标签名">
        <el-input v-model="currentTag.name" />
      </el-form-item>


      <el-form-item label="背景颜色">
        <el-color-picker v-model="currentTag.bg_color" @activeChange="activeChangeBg" show-alpha />
      </el-form-item>

      <el-form-item label="字体颜色">
        <el-color-picker v-model="currentTag.color" @activeChange="activeChangeText" show-alpha />
      </el-form-item>

    </el-form>

    <template #footer>
      <el-button plain @click="visible = false">取 消</el-button>
      <el-button plain type="primary" @click="submit">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, toRefs, PropType, reactive } from 'vue'
import { createTag, deleteTag, updateTag } from '@/api/tags'
import { ElInput } from 'element-plus';

const props = defineProps({
  tags: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  // 是否使用http上传数据
  isPost: {
    type: Boolean,
    default: true
  },
  // dialogVisible 的状态来控制inputVisible
  dialogVisible: {
    type: Boolean,
    default: true
  },
  editable: {
    type: Boolean,
    default: false
  }
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
  bg_color: ''
})
const visible = ref(false)

watch(tags, (value) => {
  list.value = value
}, { immediate: true })

watch(dialogVisible, (val) => {
  if (val) {
    inputVisible.value = false
  } else {
    inputVisible.value = true
  }
}, { immediate: true })

const handleClose = (tagId: number) => {
  const index = list.value.findIndex((item) => item.id === tagId)
  if (index !== -1) {
    list.value.splice(index, 1)
    // 上报 - 删除数据
    isPost.value && deleteTag({ id: tagId })

    // 返回标签数据给父组件
    exposeSelectedTags()
  }
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = async (): Promise<void> => {
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
      } catch {
        list.value.pop()
      }
    }

    inputValue.value = ''

    // 返回标签数据给父组件
    exposeSelectedTags()
  }
}

const exposeSelectedTags = () => {
  emit('selectedTags', list.value)
}

function checkIsDuplicate(list: Array<any>, checkValue: string): Boolean {
  const index = list.findIndex((item) => item.name === checkValue)

  if (index !== -1) {
    // 有重复的
    return true
  }

  return false
}

function handleClick(tagInfo: any): void {
  if (!editable.value) return
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
    await updateTag({ id: currentTag.id, name: currentTag.name, color: currentTag.color, bg_color: currentTag.bg_color })
    ElMessage.success('修改成功')
    visible.value = false

    emit("update", currentTag)
  } catch {
    ElMessage.error('修改失败')
  }
}

function activeChangeBg(value: any) {
  currentTag.bg_color = value
}

function activeChangeText(value: any) {
  currentTag.color = value
}
</script>

<style scoped lang="scss">
$BtnWidth: 100px;
$BtnHeight: 32px;
$MarginLeft: 10px;

:deep(.el-tag + .el-tag) {
  margin-left: $MarginLeft;
}

.button-tag {
  width: $BtnWidth;
  height: $BtnHeight;
  padding-top: 0;
  padding-bottom: 0;
  margin-left: $MarginLeft;
}

.input {
  width: $BtnWidth;
  height: $BtnHeight;
  margin-left: $MarginLeft;
}

.el-tag+.button-tag,
.el-tag+.el-input {
  margin-left: 10px !important;
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