<template>
  <div class="login">
    <div class="form">
      <el-form ref="formRef" :model="form" status-icon :rules="rules" label-width="120px">
        <el-form-item label="账户" prop="account">
          <el-input v-model="form.account" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" />
        </el-form-item>
        <el-form-item v-if="loginStaus === 'register'" label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="form.confirmPassword" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(formRef)">{{ loginBtnText }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { login, register } from '@/api/user'

const form = reactive({
  account: 'xx',
  password: '1234',
  confirmPassword: ''
})

const formRef = ref<FormInstance>()

const router = useRouter()
const route = useRoute()

enum LoginEnum {
  LOGIN = '登录',
  REGISTER = '注册'
}

enum LoginStatusEnum {
  LOGIN = 'login',
  REGISTER = 'register'
}

const loginStaus = ref(LoginStatusEnum.LOGIN)
const loginBtnText = ref(LoginEnum.LOGIN)

const { type, redirect } = route.query

// 注册
if (type === 'register') {
  form.account = ''
  form.password = ''
  form.confirmPassword = ''

  loginStaus.value = LoginStatusEnum.REGISTER
  loginBtnText.value = LoginEnum.REGISTER
}

const submitForm = (formEl: FormInstance) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    debugger
    if (valid) {
      let userInfo
      if (loginStaus.value === LoginStatusEnum.LOGIN) {
        // 登录
        userInfo = await loginFunc()
      } else {
        // 注册
        userInfo = await registerFunc()
      }

      userInfo && localStorage.setItem('userInfo', JSON.stringify(userInfo))

      const { token } = userInfo

      if (token) {
        localStorage.setItem('token', token)

        if (redirect) {
          // 重定向
          router.push(redirect)
        } else {
          // 跳转到首页
          router.push('/')
        }
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const validateAccount = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入账号'))
  } else {
    if (form.account !== '') {
      if (!formRef.value) return
    }
    callback()
  }
}

const validatePass = (rule: any, value: any, callback: any) => {
  // 注册情况下，校验确认密码
  if (form.confirmPassword) {
    formRef.value.validateField("confirmPassword")
  }
  
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (form.password !== '') {
      if (!formRef.value) return
    }
    callback()
  }
}

const validateComfirmPass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入确认密码'))
  } else if (value !== form.password) {
    callback(new Error('密码不一致'))
  } else {
    if (form.confirmPassword !== '') {
      if (!formRef.value) return
    }
    callback()
  }
}

const rules = reactive<FormRules<typeof form>>({
  account: [{ validator: validateAccount, trigger: 'blur' }],
  password: [{ validator: validatePass, trigger: 'blur' }],
  confirmPassword: [{ validator: validateComfirmPass, trigger: 'blur' }]
})

async function loginFunc(): string {
  const userInfo = await login({
    username: form.account,
    password: form.password,
  })

  return userInfo
}

async function registerFunc(): string {
  const userInfo = await register({
    username: form.account,
    password: form.password,
  })

  return userInfo
}
</script>

<style scoped lang="scss">
.login {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}

.form {
  width: 400px;
  height: 400px;
}
</style>