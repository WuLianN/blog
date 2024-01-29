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
        <el-form-item al>
          <el-button type="primary" @click="submitForm(formRef)">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { login } from '@/api/user'

const form = reactive({
  account: 'xx',
  password: '1234',
})

const formRef = ref<FormInstance>()

const router = useRouter()
const route = useRoute()

const { type } = route.query

// 注册
if (type === 'register') {
  form.account = '',
    form.password = ''
}

const submitForm = (formEl: FormInstance) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const { token } = await login({
        username: form.account,
        password: form.password,
      })

      if (token) {
        localStorage.setItem('token', token)

        // 跳转到首页
        router.push('/')
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
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (form.password !== '') {
      if (!formRef.value) return
      // formRef.value.validateField('password', () => null)
    }
    callback()
  }
}

const rules = reactive<FormRules<typeof form>>({
  account: [{ validator: validateAccount, trigger: 'blur' }],
  password: [{ validator: validatePass, trigger: 'blur' }],
})

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