<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import Modal from '@/shared/components/Modal.vue';
import { USER_TYPES } from '@/shared/utils/constants';
import { useStaff } from '../composable/useStaff';

const router = useRouter()
const usestaff = useStaff()

const { submitting: loading } = usestaff
const staffForm = ref<FormInstance>()

const staff = reactive({
  firstName: '',
  lastName: '',
  email: '',
  role: 'USER'
})

function validateEmail(rule: any, value: any, callback: any) {
  if (staff.email === '') {
    callback(new Error('Please provide an email'))
  }
  else if (!/^[\w.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(staff.email)) {
    callback(new Error('Email is not valid'))
  }
  callback()
}

function validateRequired(rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('Please provide a value'))
  }
  callback()
}

const rules = reactive<FormRules<typeof staff>>({
  email: [{ validator: validateEmail, trigger: 'change' }],
  firstName: [{ validator: validateRequired, trigger: 'change' }],
  lastName: [{ validator: validateRequired, trigger: 'change' }],
})

async function submitStaff(formEl: FormInstance | undefined) {
  if (!formEl) return

  await formEl.validate(async (valid, fields) => {
    if (!valid) {
      console.warn('Invalid fields ', fields)
      return
    }

    await usestaff.inviteStaff(staff)
    staff.email = ''
    staff.firstName = ''
    staff.lastName = ''
    staff.role = 'USER'
  })
}
</script>

<template>
  <Modal heading="Invite Staff" size="third" @close="router.back()">
    <el-form ref="staffForm" :model="staff" :rules label-position="top" size="large">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-3">
        <el-form-item label="First name" prop="firstName">
          <el-input v-model="staff.firstName" placeholder="John" />
        </el-form-item>

        <el-form-item label="Last name" prop="lastName">
          <el-input v-model="staff.lastName" placeholder="Doe" />
        </el-form-item>
      </div>

      <div class="flex gap-3">
        <el-form-item class="w-2/3" label="Email" prop="email">
          <el-input v-model="staff.email" placeholder="john.doe@example.com" />
        </el-form-item>

        <el-form-item class="w-1/3" label="Type" prop="role">
          <el-select v-model="staff.role">
            <el-option v-for="(type, key) in USER_TYPES" v-bind="type" :key />
          </el-select>
        </el-form-item>
      </div>

      <div class="flex justify-end mt-3 pt-5 border-t border-primary-50">
        <el-button @click="router.back()">
          Cancel
        </el-button>
        <el-button :loading type="primary" @click="submitStaff(staffForm)">
          Send Invitation
        </el-button>
      </div>
    </el-form>
  </Modal>
</template>
