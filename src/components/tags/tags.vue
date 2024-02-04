<template>
  <div>
    <el-tag v-for="tag in list" :key="tag.id" size="large" closable :disable-transitions="false"
      @close="handleClose(tag.id)">
      {{ tag.name }}
    </el-tag>

    <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="input" @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm" />
    <el-button v-else class="button-tag" @click="showInput">
      + New Tag
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, toRefs, unref } from 'vue'
import { createTag, deleteTag } from '@/api/tags'

const props = defineProps({
  tags: {
    type: Array,
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
  }
})

const emit = defineEmits(['getTags'])

const { tags, isPost, dialogVisible } = toRefs(props)

const list = ref([])

const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

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

const handleInputConfirm = async () => {
  if (inputValue.value) {
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
  emit('getSelectedTags', list.value)
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
</style>