<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useDraggable, useToggle } from '@vueuse/core'
import { updateUserSetting } from '@/api/user'

const formNode = ref(null)
const imageNode = ref(null)
const btnNode = ref(null)
const imageStyles = ref({})
const formStyles = ref({})
const designer = reactive({
  form: {
    left: 500,
    top: 300,
    width: '300px',
    height: '180px',
    padding: '',
    backgroundColor: '#ffffff',
    color: '',
    border: {
      width: 1,
      style: 'solid',
      color: 'rgba(0, 0, 0, 0.1)',
      radius: '4px',
    },
    input: {
      backgroundColor: '',
    },
  },
  image: {
    left: 0,
    top: 0,
    width: '100vw',
    height: '100vh',
    filter: '',
    url: '',
  },
})
const drawer = ref(true)
const drawerToggle = useToggle(drawer)

const userSetting = localStorage.getItem('user_setting')

if (userSetting) {
  const { login_designer: loginDesigner } = JSON.parse(userSetting)

  if (loginDesigner) {
    const { image, form } = JSON.parse(loginDesigner)
    image.left = image.left.replace('px', '')
    image.top = image.top.replace('px', '')
    form.left = form.left.replace('px', '')
    form.top = form.top.replace('px', '')
    designer.image = image
    designer.form = form
  }
}

const borderStyleOptions = [
  { label: '实线', value: 'solid' },
  { label: '虚线', value: 'dashed' },
  { label: '点状', value: 'dotted' },
]

const {
  x: formX,
  y: formY,
  style: formDragStyle,
} = useDraggable(formNode, {
  initialValue: { x: designer.form.left, y: designer.form.top },
})

const {
  x: imageX,
  y: imageY,
  style: imageDragStyle,
} = useDraggable(imageNode, {
  initialValue: { x: designer.image.left, y: designer.image.top },
})

const { style: btnNodeDragStyle } = useDraggable(btnNode, {
  initialValue: { x: 50, y: 50 },
})

// 使用计算属性来动态生成样式
const computedImageStyles = computed(() => ({
  width: designer.image.width,
  height: designer.image.height,
  left: designer.image.left,
  top: designer.image.top,
  filter: designer.image.filter,
}))

const computedFormStyles = computed(() => ({
  'width': designer.form.width,
  'height': designer.form.height,
  'padding': designer.form.padding,
  'background-color': designer.form.backgroundColor,
  'border-width': `${designer.form.border.width}px`,
  'border-style': designer.form.border.style,
  'border-color': designer.form.border.color,
  'border-radius': designer.form.border.radius,
}))

// 监听 designer 的变化并更新样式
watch(designer, () => {
  nextTick(() => {
    imageStyles.value = computedImageStyles.value
    formStyles.value = computedFormStyles.value
  })
})

onMounted(async () => {
  await nextTick()
  imageStyles.value = computedImageStyles.value
  formStyles.value = computedFormStyles.value
})

function handleClose() {
  drawer.value = false
}

function formBgColorChange(value: string | null) {
  if (value) {
    designer.form.backgroundColor = value
  }
}
function formColorChange(value: string | null) {
  if (value) {
    designer.form.color = value
  }
}
function formInuptBgColorChange(value: string | null) {
  if (value) {
    designer.form.input.backgroundColor = value
  }
}
function formBorderColorChange(value: string | null) {
  if (value) {
    designer.form.border.color = value
  }
}

function handleImageChange(url: string) {
  designer.image.url = url
}

async function submit() {
  const copyDesigner = JSON.parse(JSON.stringify(designer))
  copyDesigner.form.left = `${Number.parseInt(formX.value.toString(), 10)}px`
  copyDesigner.form.top = `${Number.parseInt(formY.value.toString(), 10)}px`
  copyDesigner.image.left = `${designer.image.left}px`
  copyDesigner.image.top = `${designer.image.top}px`

  try {
    await updateUserSetting({
      login_designer: JSON.stringify(copyDesigner),
    })

    ElMessage.success('保存成功!')
    drawerToggle()
  }
  catch {
    ElMessage.success('保存失败!')
  }
}
</script>

<template>
  <div class="login">
    <div
      ref="formNode"
      class="form-wrap"
      :style="formDragStyle"
      style="position: fixed"
    >
      <LoginForm :is-design="true" :style="formStyles" />
    </div>

    <div
      ref="imageNode"
      class="image-wrap"
      :style="imageDragStyle"
      style="position: fixed"
    >
      <img
        v-if="designer.image.url"
        :src="designer.image.url"
        :style="imageStyles"
      >
    </div>

    <div
      ref="btnNode"
      class="btn-wrap"
      :style="btnNodeDragStyle"
      style="position: fixed"
    >
      <el-button type="primary" plain @click="drawerToggle()">
        登录页设计
      </el-button>
    </div>

    <el-drawer
      v-model="drawer"
      title="登录页设计"
      direction="rtl"
      :modal="false"
      :before-close="handleClose"
    >
      <el-form :form="designer">
        <el-divider content-position="left">
          背景图片
        </el-divider>
        <el-form-item label="图片上传">
          <avatar-upload
            :width="64"
            :height="64"
            :img-url="designer.image.url"
            @change="handleImageChange"
          />
        </el-form-item>
        <el-form-item label="图片链接">
          <el-input v-model="designer.image.url" />
        </el-form-item>
        <el-form-item label="宽度">
          <el-input v-model="designer.image.width" />
        </el-form-item>
        <el-form-item label="高度">
          <el-input v-model="designer.image.height" />
        </el-form-item>
        <el-form-item label="滤镜">
          <el-input v-model="designer.image.filter" />
        </el-form-item>
        <el-form-item label="left">
          <el-input v-model="imageX" />
        </el-form-item>
        <el-form-item label="top">
          <el-input v-model="imageY" />
        </el-form-item>

        <el-divider content-position="left">
          登录框
        </el-divider>

        <el-form-item label="背景颜色">
          <el-color-picker
            v-model="designer.form.backgroundColor"
            show-alpha
            @active-change="formBgColorChange"
          />
        </el-form-item>
        <el-form-item label="文字颜色">
          <el-color-picker
            v-model="designer.form.color"
            show-alpha
            @active-change="formColorChange"
          />
        </el-form-item>
        <el-form-item label="输入框颜色">
          <el-color-picker
            v-model="designer.form.input.backgroundColor"
            show-alpha
            @active-change="formInuptBgColorChange"
          />
        </el-form-item>
        <el-form-item label="宽度">
          <el-input v-model="designer.form.width" />
        </el-form-item>
        <el-form-item label="高度">
          <el-input v-model="designer.form.height" />
        </el-form-item>
        <el-form-item label="内边距">
          <el-input v-model="designer.form.padding" />
        </el-form-item>
        <el-form-item label="边框大小">
          <el-input v-model="designer.form.border.width" type="number" />
        </el-form-item>
        <el-form-item label="边框样式">
          <el-select v-model="designer.form.border.style">
            <el-option
              v-for="item in borderStyleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="边框颜色">
          <el-color-picker
            v-model="designer.form.border.color"
            show-alpha
            @active-change="formBorderColorChange"
          />
        </el-form-item>
        <el-form-item label="外边框圆角">
          <el-input v-model="designer.form.border.radius" />
        </el-form-item>

        <el-form-item label="left">
          <el-input v-model="formX" />
        </el-form-item>
        <el-form-item label="top">
          <el-input v-model="formY" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button plain type="success" @click="submit">
          保存
        </el-button>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.login {
  width: 100vw;
  height: 100vh;
  background-repeat: no-repeat;
  object-fit: contain;
}

.form-wrap,
.btn-wrap {
  z-index: 10000;
}

.image-wrap {
  z-index: 1;

  img {
    pointer-events: none;
  }
}

.form-wrap :deep(.el-form-item__label) {
  color: v-bind("designer.form.color");
}

.form-wrap :deep(.el-input__inner) {
  color: v-bind("designer.form.color");
}

.form-wrap :deep(.el-input__wrapper) {
  background-color: v-bind("designer.form.input.backgroundColor");
}

:deep(.el-drawer__footer) {
  text-align: center;
}
</style>
