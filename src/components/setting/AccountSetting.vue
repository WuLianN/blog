<template>
  <div>
    <el-form ref="formRef" :model="form" status-icon :rules="rules" label-width="100px" label-position="left">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="form.oldPassword" type="password" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" />
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmNewPassword">
        <el-input v-model="form.confirmNewPassword" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button plain type="primary" @click="submit(formRef)">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { login, changePassword  } from '@/api/user'

const formRef = ref<FormInstance>()

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
})

const store = useUserStore()

function submit(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const data = {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      }
      try {
        await changePassword(data)
        ElMessage.success("修改成功!")
      } catch {
        ElMessage.error("修改失败!")
      }

      await loginFunc()
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const validOldPass = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入旧密码'))
  } else {
    if (form.oldPassword !== '') {
      if (!formRef.value) return
    }
    callback()
  }
}

const validNewPass = (_rule: any, value: any, callback: any) => {
  // 校验确认密码
  if (form.confirmNewPassword) {
    formRef.value?.validateField("confirmNewPassword")
  }

  if (value === '') {
    callback(new Error('请输入新密码'))
  } else {
    if (form.newPassword !== '') {
      if (!formRef.value) return
    }
    callback()
  }
}

const validConfirmNewPass = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入确认新密码'))
  } else if (value !== form.newPassword) {
    callback(new Error('密码不一致'))
  } else {
    if (form.confirmNewPassword !== '') {
      if (!formRef.value) return
    }
    callback()
  }
}

const rules = reactive<FormRules<typeof form>>({
  oldPassword: [{ validator: validOldPass, trigger: 'blur' }],
  newPassword: [{ validator: validNewPass, trigger: 'blur' }],
  confirmNewPassword: [{ validator: validConfirmNewPass, trigger: 'blur' }]
})

async function loginFunc(): Promise<any> {
  const localUserInfo = JSON.parse(localStorage.getItem('userInfo') as string)
  let userName = store.userInfo.user_name ?? localUserInfo.user_name

  const userInfo = await login({
    username: userName,
    password: form.newPassword,
  })

  return userInfo
}
</script>

<style scoped lang="scss"></style>