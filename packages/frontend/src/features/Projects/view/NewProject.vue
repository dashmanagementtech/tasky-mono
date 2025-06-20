<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import AddNewClient from '@/features/Clients/view/AddNewClient.vue';
import Modal from '@/shared/components/Modal.vue';

import{ PROJECT_TYPES} from '@/shared/utils/constants'
import { useProject } from '../composable/useProjects';
import { useClient } from '@/features/Clients/composable/useClient';

const router = useRouter()
const useproject = useProject()
const useclient = useClient()

const { submitting: clientSubmitting, oneclient, searchClient } = useclient

const { submitting } = useproject;
const projectForm = ref<FormInstance>()

const page = ref<'project' | 'client'>('project')
const client = ref('')
const project = reactive({
  title: '',
  description: '',
  startDate: new Date(),
  endDate: new Date(),
  cuid: '',
  type: 'WORD_PRESS'
})

function validateRequiredField(value: string, callback: any) {
  if ((project as Record<string, any>)[value] === '') {
    callback(new Error('Please provide a value'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<typeof project>>({
  title: [{
    validator: (val: any, rule: any, callback: any) => {
      validateRequiredField('title', callback)
    }, trigger: 'change'
  }],
  description: [{
    validator: (val: any, rule: any, callback: any) => {
      validateRequiredField('description', callback)
    }, trigger: 'change'
  }],
  cuid: [{
    validator: (val: any, rule: any, callback: any) => {
      validateRequiredField('cuid', callback)
    }, trigger: 'change'
  }]
})

function disabledDate(time: Date) {
  return time.getTime() < Date.now()
}

async function searchClients(query: string, cb: any) {
  await searchClient(query)

  cb(oneclient.value.map((item: any) => ({ ...item, value: `${item.firstName} ${item.lastName}` })))
}

async function submitProject(formEl: FormInstance | undefined) {
  if (!formEl) return

  await formEl.validate(async (valid, fields) => {
    if (!valid) {
      console.warn('Invalid fields: ', fields)
      return
    }

    await useproject.createProject(project)
    router.back()
  })
}
</script>

<template>
  <Modal v-if="page === 'project'" heading="Create New Project" size="half" @close="$router.back()">
    <el-form ref="projectForm" :model="project" :rules label-position="top" size="large">
      <div class="flex gap-3">
        <el-form-item class="w-2/3" prop="title" label="Project Name">
          <el-input type="text" placeholder="Rocky plains" v-model="project.title" />
        </el-form-item>

        <el-form-item class="w-1/3" prop="type" label="Project Type">
          <el-select placeholder="Select project" v-model="project.type">
            <el-option :value="type.value" :label="type.label" v-for="type in PROJECT_TYPES" :key="type.label" />
          </el-select>
        </el-form-item>
      </div>

      <el-form-item prop="description" label="Project Description">
        <el-input type="textarea" v-model="project.description" placeholder="Building the next big thing." />
      </el-form-item>

      <div class="grid grid-cols-3 gap-3">
        <el-form-item prop="startDate" label="Project Start Date">
          <el-date-picker class="w-full" v-model="project.startDate" placeholder="Project start date" :disabled-date="disabledDate" />
        </el-form-item>

        <el-form-item prop="endDate" label="Project End Date">
          <el-date-picker v-model="project.endDate" placeholder="Project end date" :disabled-date="disabledDate" />
        </el-form-item>

        <el-form-item prop="cuid" label="Client">
          <template #label>
            <div class="flex items-center justify-between">
              Client
              <b class="text-xs font-semibold text-primary/50 cursor-pointer hover:text-primary" @click="page = 'client'">
                Create New Client
              </b>
            </div>
          </template>
          <el-autocomplete v-model="client" @select="(item: any) => project.cuid = item.id" :fetch-suggestions="searchClients" placeholder="Search clients...">
            <template #default="{ item }">
              <div class="text-sm">{{ item.firstName }} {{ item.lastName }}</div>
              <span class="block text-xs -mt-0.5">{{ item.email }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
      </div>

      <div class="flex justify-end mt-3 pt-5 border-t border-primary-50">
        <el-button @click="$router.back()">
          Cancel
        </el-button>
        <el-button :loading="submitting" type="primary" @click="submitProject(projectForm)">
          Create Project
        </el-button>
      </div>
    </el-form>
  </Modal>
  <AddNewClient inline @close="page = 'project'" v-else />
</template>
