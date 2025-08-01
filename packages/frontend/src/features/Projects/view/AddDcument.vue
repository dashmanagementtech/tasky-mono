<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Modal from '@/shared/components/Modal.vue';
import { useProject } from '../composable/useProjects';

const route = useRoute()
const router = useRouter()
const useproject = useProject()

const submitting = ref(false)
const docFormRef = ref<FormInstance>()
const document = reactive({
  title: "",
  url: ""
})

const rules = reactive<FormRules<typeof document>>({})

async function submitDoc(formRef: FormInstance | undefined) {
  if (!formRef) return

  await formRef.validate(async (valid, fields) => {
    if (!valid) {
      console.warn("invalid fields; ", fields)
      return
    }

    submitting.value = true

    try {
      await useproject.addDocumentToProject(route.params.id as string, document)
      router.back()
    } catch (error) {
      console.warn(error)
    } finally {
      submitting.value = false
    }
  })
}
</script>

<template>
  <Modal heading="Add New Documents" size="third" @close="router.back()">
    <el-form ref="docFormRef" :rules :model="document" label-position="top" size="large">
      <el-form-item label="Document Name" prop="title">
        <el-input v-model="document.title" placeholder="Document Name" />
      </el-form-item>
      <el-form-item label="Document URL" prop="url">
        <el-input v-model="document.url" placeholder="Document URL" />
      </el-form-item>

      <div class="flex justify-end mt-3 pt-5 border-t border-primary-50">
        <el-button @click="$router.back()">
          Cancel
        </el-button>
        <el-button :loading="submitting" type="primary" @click="submitDoc(docFormRef)">
          Add Document
        </el-button>
      </div>
    </el-form>
  </Modal>
</template>
