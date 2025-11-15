<script setup lang="ts">
import Editor from '@blog/markdown-editor/src/components/Editor.vue'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { debounce } from 'lodash-es'
import { getUserDraft, publishDraft, saveDraft } from '@/api/drafts'
import { uploadFile } from '@/api/upload'
import { useNavigateTo } from '@/hooks/web/useNavigate'

const title = ref('')
const content = ref('')
const status = ref('文章将自动保存至草稿箱')
const debounceWaitMs = 300
const debounceSave = debounce(save, debounceWaitMs)

const draftId = getDraftId()

if (draftId)
  getDraftDetail()

watch(title, () => {
  debounceSave(title.value, content.value)
})

watch(content, (_value, oldValue) => {
  if (!content.value) {
    saveBefore(title.value, content.value, oldValue)
  }
  else {
    debounceSave(title.value, content.value)
  }
})

function getDraftId() {
  const route = useRoute()
  const { path } = route
  const regexp = /\/drafts\/(\d+)/
  const match = regexp.exec(path)
  return match?.[1]
}

function contentChange(value: string) {
  content.value = value
}

async function getDraftDetail() {
  if (draftId) {
    const { title: titleAlia, content: contentAlia } = await getUserDraft({ id: Number.parseInt(draftId, 10) })
    title.value = titleAlia
    content.value = contentAlia
  }
}

function saveBefore(title: string, emptyContent: string, oldContentValue: string) {
  if (!emptyContent) {
    ElMessageBox.confirm('是否清空文章内容，无法找回！！！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      save(title, emptyContent)
    }).catch(() => {
      content.value = oldContentValue
    })
  }
}

async function save(title: string, content: string) {
  if (draftId) {
    try {
      await saveDraft({ title, content, id: Number.parseInt(draftId, 10) })
      status.value = '保存成功'
    }
    catch {
      status.value = '保存失败'
    }
  }
}

function goDraftBox() {
  useNavigateTo('/draftBox')
}

async function publish(isPrivacy: number) {
  if (draftId) {
    const id = Number.parseInt(draftId, 10)
    try {
      await publishDraft(id, isPrivacy)
      ElMessage.success('发布成功！')
      useNavigateTo('/')
    }
    catch {
      ElMessage.error('发布失败！')
    }
  }
}

async function upload(file: File) {
  const formData = new FormData()
  formData.append('type', '1')
  formData.append('file', file)

  return uploadFile(formData)
    .then((result) => {
      const { file_access_url: url } = result
      return { url }
    })
    .catch(() => {
      return ''
    })
}
</script>

<template>
  <header class="editor-header">
    <div class="left-box">
      <input v-model="title" placeholder="输入文章标题..." spellcheck="false" maxlength="80" class="title-input">
    </div>

    <div class="right-box">
      <div title="" class="status-text with-padding">
        {{ status }}
      </div>
      <el-button plain type="primary" @click="goDraftBox">
        草稿箱
      </el-button>
      <el-button plain type="danger" @click="publish(1)">
        私密发布
      </el-button>
      <el-button plain type="success" @click="publish(0)">
        发布
      </el-button>
    </div>
  </header>
  <Editor :content="content" :upload="upload" @content-change="contentChange" />
</template>

<style scoped lang="scss">
$header-height: 64px;

.editor-header {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  padding: 0 27px;
  height: $header-height;
  background-color: #fff;
  border-bottom: 1px solid #ddd;

  @at-root html.dark & {
    background-color: var(--el-bg-color-overlay);
    border-bottom: 1px solid var(--el-border-color);
  }
}

.title-input {
  margin: 0;
  padding: 0;
  font-size: 24px;
  font-weight: 500;
  color: #1d2129;
  border: none;
  outline: none;
  background: #fff;
  width: 800px;
  height: 100%;

  @at-root html.dark & {
    color: var(--el-text-color-primary);
    background: var(--el-bg-color-overlay);
  }
}

.right-box {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
}

.with-padding {
  margin-left: 8px;
  margin-right: 8px;
}

.status-text {
  font-size: 14px;
  white-space: nowrap;
  color: #c9cdd4;
  cursor: default;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  @at-root html.dark & {
    color: var(--el-text-color-secondary);
  }
}

@media screen and (max-width: 992px) {
  .title-input {
    width: 150px;
  }
  .status-text {
    display: none;
  }
}
</style>
