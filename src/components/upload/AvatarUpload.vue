<template>
  <el-upload class="avatar-uploader" :action="action" :show-file-list="false" :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload" :data="data">
    <img v-if="imageUrl" :src="imageUrl" class="avatar" :style="avatarStyle" />
    <el-icon v-else class="avatar-uploader-icon" :style="avatarStyle">
      <Plus />
    </el-icon>
  </el-upload>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps } from 'element-plus'

const props = defineProps({
  width: {
    type: Number,
    default: 178
  },
  height: {
    type: Number,
    default: 178,
  },
  imgUrl: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['change'])

const { width, height, imgUrl } = toRefs(props)

const avatarStyle = {
  width: width.value + 'px',
  height: height.value + 'px'
}

const data = {
  type: 1
}

const imageUrl = imgUrl

const action = import.meta.env.VITE_APP_BASE_API + import.meta.env.VITE_APP_UPLOAD_URL

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response
) => {
  const { code, result } = response

  if (code === 0) {
    const { file_access_url: url } = result
    imageUrl.value = url

    emit('change', url)
  }
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const allImageType = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']
  if (!allImageType.includes(rawFile.type)) {
    ElMessage.error('不支持该图片格式')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
</script>
<style scoped>
:deep(.el-upload) {
  border: 1px dashed var(--el-border-color) !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast) !important;
}

:deep(.el-upload:hover) {
  border-color: var(--el-color-primary) !important;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
