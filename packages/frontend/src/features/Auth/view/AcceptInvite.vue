<script lang="ts" setup>
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
// @ts-expect-error Type not declared
import AppLogo from '@/shared/components/Logo.vue'
// @ts-expect-error Type not declared
import { validatePassword } from '@/shared/utils/helpers'
import { useAuth } from '../composable/useAuth'

const router = useRouter()
const auth = useAuth()

const loading = auth.loading

const passwordSetForm = ref<FormInstance>()
const data = reactive({
  password: '',
  confirm: '',
})

function validateUserPassword(_rules: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('Please provide a password'))
  }
  else if (value.length < 8) {
    callback(new Error('Password must be at least 8 character long'))
  }
  else if (!validatePassword(data.password)) {
    callback(new Error('Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'))
  } else {
    callback()
  }
}

function validateUserConfirmPassword(_rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('Please provide a value'))
  } else if (value !== data.password) {
    callback(new  Error('Password does not match'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<typeof data>>({
  password: [{ validator: validateUserPassword, trigger: 'change' }],
  confirm: [{ validator: validateUserConfirmPassword, trigger: 'change' }],
})

async function submit(formEl: FormInstance | undefined) {
  if (!formEl)
    return

  await formEl.validate((valid, fields) => {
    if (valid) {
      console.warn({ data })
      ElMessage.success('Welcome, please login to continue')
      router.replace({ name: 'login' })
    }
    else {
      console.warn('fields error; ', fields)
    }
  })
}
</script>

<template>
  <section class="h-auto w-1/4 shadow rounded bg-white/90 p-5">
    <div class="flex flex-col gap-3 items-center justify-center pt-5 pb-1">
      <AppLogo />
      <h1 class="text-2xl font-semibold text-primary capitalize">
        Accept Invitation
      </h1>
    </div>

    <p class="text-center">
      You have been invited to join this project, please set your password to continue
    </p>

    <el-form ref="passwordSetForm" :model="data" :rules label-position="top" size="large" class="my-3">
      <el-form-item label="Password" prop="password">
        <el-input v-model="data.password" type="password" placeholder="horse shoulders lagos warri" show-password />
      </el-form-item>

      <el-form-item label="Confirm Password" prop="confirm">
        <el-input v-model="data.confirm" type="password" placeholder="horse shoulders lagos warri" show-password />
      </el-form-item>

      <el-button type="primary" class="w-full" :loading @click="submit(passwordSetForm)">
        Submit
      </el-button>
    </el-form>
  </section>
</template>
