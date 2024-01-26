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
import { useRouter } from 'vue-router'

const form = reactive({
  account: 'admin',
  password: '123456',
})

const formRef = ref<FormInstance>()

const router = useRouter()

const submitForm = (formEl: FormInstance) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')

      console.log(useRouter)

      // 跳转到首页
      router.push('/home')
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