<script lang="ts" setup>
import type { ILoginData } from '@dash/shared'
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
// @ts-expect-error Type not declared
import AppLogo from '@/shared/components/Logo.vue'

const router = useRouter()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const auth = reactive<ILoginData>({
  email: '',
  password: '',
})

function validateEmail(rule: any, value: any, callback: any) {
  if (auth.email === '') {
    callback(new Error('Please provide an email'))
  }
  else if (!/^[\w.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(auth.email)) {
    callback(new Error('Email is not valid'))
  }
  callback()
}

function validatePassword(rule: any, value: any, callback: any) {
  if (auth.password === '') {
    callback(new Error('Please provide a password'))
  }
  callback()
}

const rules = reactive<FormRules<typeof auth>>({
  email: [{ validator: validateEmail, trigger: 'change' }],
  password: [{ validator: validatePassword, trigger: 'change' }]
})

async function submitAuth(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (!valid) {
      console.warn('Invalid fields ', fields)
      return
    }

    router.push('/app/dashboard')
  })
}
</script>

<template>
  <section class="h-auto w-1/4 shadow rounded bg-white/90 p-5">
    <div class="flex flex-col gap-3 items-center justify-center py-5">
      <AppLogo />
      <h1 class="text-2xl font-semibold text-primary capitalize">
        Login
      </h1>
    </div>
    <el-form :model="auth" ref="loginFormRef" label-width="auto" size="large" label-position="top" :rules @submit.prevent="submitAuth(loginFormRef)">
      <el-form-item label="Email" prop="email">
        <el-input v-model="auth.email" type="email" placeholder="john.doe@example.com" />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="auth.password" type="password" placeholder="haskell donkey at havard" show-password />
      </el-form-item>
      <div class="flex items-center justify-between mb-3">
        <el-checkbox label="Remember me" />
        <router-link to="/forgot-password" class="text-xs text-primary underline">
          Forgot your password?
        </router-link>
      </div>
      <el-button type="primary" class="w-full" :loading @click.prevent="submitAuth(loginFormRef)">
        Continue
      </el-button>
    </el-form>
  </section>
</template>
