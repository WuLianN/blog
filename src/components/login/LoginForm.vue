<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { login, register } from '@/api/user'
import type { LoginResult } from '@/api/model/userModel'

const props = defineProps({
  isDesign: { type: Boolean, default: false },
})

const { isDesign } = toRefs(props)

const form = reactive({
  account: '',
  password: '',
  confirmPassword: '',
})

const formRef = ref<FormInstance>()

const router = useRouter()
const route = useRoute()

enum LoginEnum {
  LOGIN = '登录',
  REGISTER = '注册',
}

enum LoginStatusEnum {
  LOGIN = 'login',
  REGISTER = 'register',
}

const loginStaus = ref(LoginStatusEnum.LOGIN)
const loginBtnText = ref(LoginEnum.LOGIN)
const lableWidth = ref(60)

const { type, redirect } = route.query

// 注册
if (type === 'register') {
  form.account = ''
  form.password = ''
  form.confirmPassword = ''

  loginStaus.value = LoginStatusEnum.REGISTER
  loginBtnText.value = LoginEnum.REGISTER
  lableWidth.value = 80
}

function submitForm(formEl: FormInstance | undefined) {
  if (isDesign.value) {
    return
  }
  if (!formEl)
    return
  formEl.validate(async (valid) => {
    if (valid) {
      let userInfo
      if (loginStaus.value === LoginStatusEnum.LOGIN) {
        // 登录
        userInfo = await loginFunc()
      }
      else {
        // 注册
        userInfo = await registerFunc()
      }

      userInfo && localStorage.setItem('userInfo', JSON.stringify(userInfo))

      if (redirect) {
        // 重定向
        router.push(redirect as string)
      }
      else {
        // 跳转到首页
        router.push('/')
      }
    }
  })
}

function validateAccount(_rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('请输入账号'))
  }
  else {
    if (form.account !== '') {
      if (!formRef.value)
        return
    }

    callback()
  }
}

function validatePass(_rule: any, value: any, callback: any) {
  // 注册情况下，校验确认密码
  if (form.confirmPassword)
    formRef.value?.validateField('confirmPassword')

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

function validateComfirmPass(_rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('请输入确认密码'))
  }
  else if (value !== form.password) {
    callback(new Error('密码不一致'))
  }
  else {
    if (form.confirmPassword !== '') {
      if (!formRef.value)
        return
    }

    callback()
  }
}

const rules = reactive<FormRules<typeof form>>({
  account: [{ validator: validateAccount, trigger: 'blur' }],
  password: [{ validator: validatePass, trigger: 'blur' }],
  confirmPassword: [{ validator: validateComfirmPass, trigger: 'blur' }],
})

async function loginFunc(): Promise<LoginResult> {
  const userInfo = await login({
    username: form.account,
    password: form.password,
  })

  return userInfo
}

async function registerFunc(): Promise<LoginResult> {
  const userInfo = await register({
    username: form.account,
    password: form.password,
  })

  return userInfo
}
</script>

<template>
  <div class="form">
    <el-form
      ref="formRef"
      :model="form"
      status-icon
      :rules="rules"
      :label-width="lableWidth"
    >
      <el-form-item label="账户" prop="account">
        <el-input v-model="form.account" @keyup.enter="submitForm(formRef)" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          @keyup.enter="submitForm(formRef)"
        />
      </el-form-item>
      <el-form-item
        v-if="loginStaus === 'register'"
        label="确认密码"
        prop="confirmPassword"
      >
        <el-input
          v-model="form.confirmPassword"
          type="password"
          @keyup.enter="submitForm(formRef)"
        />
      </el-form-item>
      <el-form-item>
        <el-button plain type="primary" @click="submitForm(formRef)">
          {{ loginBtnText }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.form {
  padding: 20px 20px 2px 20px;
}
</style>
