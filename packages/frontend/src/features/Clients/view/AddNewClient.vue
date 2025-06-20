<script setup lang="ts">import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import Modal from '@/shared/components/Modal.vue'
import { useClient } from '../composable/useClient';


const { inline = false } = defineProps<{ inline?: boolean }>()
const emit = defineEmits(['close', 'done'])

const router = useRouter()
const useclient = useClient()

const { submitting } = useclient
const clientFormRef = ref<FormInstance>()
const client = reactive({
  email: '',
  firstName: '',
  lastName: '',
})
const rules = reactive<FormRules<typeof client>>({})

function handleClose() {
  if (inline) {
    emit('close')
  }
  else {
    router.back()
  }
}

async function submitClient(formEl: FormInstance | undefined) {
  if (!formEl) return

  await formEl.validate(async (valid, fields) => {
    if (!valid) {
      console.warn('Invalid fields; ', fields)
      return
    }

    await useclient.addNewClient(client)
    handleClose()
  })
}
</script>

<template>
  <Modal heading="Create New Client" size="third" @close="handleClose">
    <el-form ref="clientFormRef" :model="client" :rules label-position="top" size="large">
      <div class="grid gap-3 md:grid-cols-2">
        <el-form-item prop="firstName" label="First Name">
          <el-input v-model="client.firstName" placeholder="John" />
        </el-form-item>

        <el-form-item prop="lastName" label="Last Name">
          <el-input v-model="client.lastName" placeholder="Doe" />
        </el-form-item>
      </div>

      <el-form-item prop="email" label="Email">
        <el-input v-model="client.email" placeholder="john.doe@example.com" />
      </el-form-item>

      <div class="flex justify-end mt-3 pt-5 border-t border-primary-50">
        <el-button @click="handleClose">
          Cancel
        </el-button>
        <el-button :loading="submitting" type="primary" @click="submitClient(clientFormRef)">
          Create Client
        </el-button>
      </div>
    </el-form>
  </Modal>
</template>
