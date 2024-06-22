<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import Sortable from 'sortablejs'
import { QuestionFilled } from '@element-plus/icons-vue'
import { useCssVar } from '@vueuse/core'
import type { SortableEvent } from 'sortablejs'
import { bingUser, changeAccount, getBindedUserList, saveBindedUserSort, unbindUser } from '@/api/user'
import type { AssociationUserInfo } from '@/api/model/userModel'
import { useUserStore } from '@/store/modules/user'
import { useNavigateReplace } from '@/hooks/web/useNavigate'

const dialogVisible = ref(false)
const form = reactive({
  username: '',
  password: '',
})
const formRef = ref<FormInstance>()
const list = ref<AssociationUserInfo[]>([])
const userStore = useUserStore()

const defaultAvatar = 'https://api.bearcub.club/static/f59dba31b7e35b34915a46af75b037f2.png'

const dialogWidth = ref('30%')
const primaryVarName = '--el-color-primary' // css变量名
const iconColor = useCssVar(primaryVarName)
const isSortMode = ref(false)

setDialogWidth()

getList()

function validateUsername(_rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('请输入账号'))
  }
  else {
    if (form.username !== '') {
      if (!formRef.value)
        return
    }

    callback()
  }
}

function validatePass(_rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('请输入密码'))
  }
  else {
    if (form.password !== '') {
      if (!formRef.value)
        return
    }

    callback()
  }
}

const rules = reactive<FormRules<typeof form>>({
  username: [{ validator: validateUsername, trigger: 'blur' }],
  password: [{ validator: validatePass, trigger: 'blur' }],
})

async function binding(formEl: FormInstance | undefined) {
  if (!formEl)
    return
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        await bingUser(form)
        dialogVisible.value = false
        ElMessage.success('绑定成功')
        getList()
      }
      catch {

      }
    }
  })
}

async function unbind(id: number) {
  if (id) {
    try {
      ElMessageBox.confirm('是否解绑该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await unbindUser(id)
        ElMessage.success('解绑成功')
        const index = list.value.findIndex(item => item.id === id)
        if (index !== -1)
          list.value.splice(index, 1)
      },
      ).catch(() => {
        ElMessage.info('已取消')
      })
    }
    catch {
      ElMessage.error('解绑失败')
    }
  }
}

async function getList() {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    const userInfo = JSON.parse(userInfoStr)
    const { id } = userInfo
    const result = await getBindedUserList(id)
    list.value = []
    list.value.push(...result)

    // 拖拽
    nextTick(() => {
      initSortList()
    })
  }
}

async function changeAccountFunc(id: number) {
  try {
    const result = await changeAccount(id)
    const resultJson = JSON.stringify(result)
    localStorage.setItem('userInfo', resultJson)
    userStore.setUserInfo(result)
    useNavigateReplace('/')
  }
  catch {

  }
}

function setDialogWidth() {
  const checkMedia = window.matchMedia('only screen and (max-width: 1000px)').matches
  if (checkMedia)
    dialogWidth.value = '80%'
  else
    dialogWidth.value = '30%'
}

function goVisit(id: number) {
  window.open(`https://bearcub.club/user/${id}`, '_blank')
}

function initSortList() {
  const list: HTMLElement | null = document.querySelector('.list')
  if (list) {
    Sortable.create(list, {
      animation: 150,
      onStart: handlerSortStart,
      onEnd: handleSortEnd,
    })
  }
}

function handlerSortStart() {
  isSortMode.value = true
}

function handleSortEnd({ oldIndex, newIndex }: SortableEvent) {
  if (oldIndex !== undefined && newIndex !== undefined) {
    const targetRow = list.value.splice(oldIndex, 1)[0]
    list.value.splice(newIndex, 0, targetRow)
  }
}

async function saveSort() {
  const data = list.value.map((item, index: number) => ({
    id: item.id,
    sort: index + 1,
  }))

  await saveBindedUserSort(data)

  isSortMode.value = false
}

onMounted(() => {
  addEventListener('resize', setDialogWidth)
})

onUnmounted(() => {
  removeEventListener('resize', setDialogWidth)
})
</script>

<template>
  <div class="icon-wrapper">
    <el-tooltip placement="top" content="支持拖拽排序">
      <el-icon :color="iconColor">
        <QuestionFilled />
      </el-icon>
    </el-tooltip>
  </div>
  <div v-if="list && list.length > 0" class="list">
    <div v-for="(item) in list" :key="item.id" class="list-row">
      <div class="list-row-left">
        <el-avatar class="list-row-left-avatar" :width="64" :height="64" :src="item.avatar || defaultAvatar" />
        <el-text>{{ item.user_name }}</el-text>
      </div>
      <div class="list-row-right">
        <el-button type="danger" plain @click="unbind(item.id)">
          解绑
        </el-button>

        <el-button type="primary" plain @click="goVisit(item.id)">
          访问
        </el-button>

        <el-button type="success" plain @click="changeAccountFunc(item.id)">
          切换
        </el-button>
      </div>
    </div>
  </div>

  <div class="btn-wrapper">
    <el-button v-if="!isSortMode" plain type="primary" @click="dialogVisible = true">
      添加关联
    </el-button>
    <el-button v-else plain type="primary" @click="saveSort">
      保存
    </el-button>
  </div>

  <el-dialog v-model="dialogVisible" title="添加关联" :width="dialogWidth">
    <el-form ref="formRef" :model="form" status-icon :rules="rules" label-width="60px">
      <el-form-item label="账户" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button plain type="primary" @click="binding(formRef)">
          绑定
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped lang="scss">
.list {
  margin-bottom: 50px;

  &-row {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--el-border-color);
    border-left: 1px solid var(--el-border-color);
    border-right: 1px solid var(--el-border-color);

    &-left,
    &-right {
      padding: 5px 0;
    }

    &-left {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      margin-left: 15px;

      &-avatar {
        margin-right: 15px;
      }
    }

    &-right {
      margin-right: 15px;
    }
  }

  &-row:last-child {
    border-bottom: 1px solid var(--el-border-color);
  }
}

.btn-wrapper {
  margin-bottom: 50px;
}

.icon-wrapper {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  padding: 0 0 10px 0;
}
</style>
