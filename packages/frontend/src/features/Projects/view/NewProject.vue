<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router';

import { useClient } from '@/features/Clients/composable/useClient'

import AddNewClient from '@/features/Clients/view/AddNewClient.vue'
import { useStaff } from '@/features/Staff/composable/useStaff'
import Modal from '@/shared/components/Modal.vue'

import { PROJECT_TYPES, PROJECT_USER_TYPES } from '@/shared/utils/constants'
import { validateRequiredField } from '@/shared/utils/helpers'
import { useProject } from '../composable/useProjects'

const route = useRoute()
const router = useRouter()
const useproject = useProject()
const useclient = useClient()
const usestaff = useStaff()

const { staff, searchStaffByKeyword } = usestaff
const { oneclient, searchClient } = useclient

const { submitting } = useproject
const projectForm = ref<FormInstance>()

const page = ref<'project' | 'client'>('project')
const client = ref(route.query.clientName.replaceAll('+', ' ') ?? '')

const project = reactive({
  title: '',
  description: '',
  startDate: new Date(),
  endDate: new Date(),
  cuid: route.query.clientId ?? '',
  type: 'WORD_PRESS',
  staff: [] as { uid: string, userRole: string, keyword: string }[],
})

const rules = reactive<FormRules<typeof project>>({
  title: [{
    validator: (val: any, rule: any, callback: any) => {
      validateRequiredField(project, 'title', callback)
    },
    trigger: 'change',
  }],
  description: [{
    validator: (val: any, rule: any, callback: any) => {
      validateRequiredField(project, 'description', callback)
    },
    trigger: 'change',
  }],
  cuid: [{
    validator: (val: any, rule: any, callback: any) => {
      validateRequiredField(project, 'cuid', callback)
    },
    trigger: 'change',
  }],
})

function disabledDate(time: Date) {
  return time.getTime() < Date.now()
}

async function searchClients(query: string, cb: any) {
  await searchClient(query)

  cb(oneclient.value.map((item: any) => ({ ...item, value: `${item.firstName} ${item.lastName}` })))
}

async function searchStaff(query: string, cb: any) {
  await searchStaffByKeyword(query)

  const allProjectStaffUids = project.staff.map(({ uid }) => uid )

  const availableStaff = staff.value
  .filter((member: any) => {
    const isAssigned = allProjectStaffUids.includes(member.id);
    return !isAssigned;
  })
  .map((member: any) => ({
    ...member,
    value: `${member.firstName} ${member.lastName}`,
  }));

  cb(availableStaff)
}

async function submitProject(formEl: FormInstance | undefined) {
  if (!formEl)
    return

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
      <el-scrollbar class="!h-[40vh] overflow-y-auto">
        <div class="flex gap-3">
          <el-form-item class="w-2/3" prop="title" label="Project Name">
            <el-input v-model="project.title" type="text" placeholder="Rocky plains" />
          </el-form-item>

          <el-form-item class="w-1/3" prop="type" label="Project Type">
            <el-select v-model="project.type" placeholder="Select project">
              <el-option v-for="type in PROJECT_TYPES" :key="type.label" :value="type.value" :label="type.label" />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item prop="description" label="Project Description">
          <el-input v-model="project.description" type="textarea" placeholder="Building the next big thing." />
        </el-form-item>

        <div class="grid grid-cols-3 gap-3">
          <el-form-item prop="startDate" label="Project Start Date">
            <el-date-picker v-model="project.startDate" class="w-full" placeholder="Project start date" />
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
            <el-autocomplete v-model="client" :fetch-suggestions="searchClients" placeholder="Search clients..." @select="(item: any) => project.cuid = item.id">
              <template #default="{ item }">
                <div class="text-sm">
                  {{ item.firstName }} {{ item.lastName }}
                </div>
                <span class="block text-xs -mt-0.5">{{ item.email }}</span>
              </template>
            </el-autocomplete>
          </el-form-item>
        </div>

        <div class="bg-gray-50/50 rounded p-3">
          <el-form-item label="Assign Staff" />

          <div v-for="(staff, key) in project.staff" :key class="grid grid-cols-2 gap-3 -mt-4">
            <el-form-item label="Staff Name">
              <el-autocomplete v-model="staff.keyword" :fetch-suggestions="searchStaff" placeholder="Search staff..." @select="(item: any) => staff.uid = item.id">
                <template #default="{ item }">
                  <div class="text-sm py-2">
                    {{ item.firstName }} {{ item.lastName }}
                  </div>
                </template>
              </el-autocomplete>
            </el-form-item>

            <el-form-item label="Staff Role">
              <el-select v-model="staff.userRole">
                <el-option v-for="item in PROJECT_USER_TYPES" :label="item" :value="item" :key="item" />
              </el-select>
            </el-form-item>
          </div>

          <el-button @click="project.staff.push({ uid: '', userRole: '', keyword: '' })">
            Add {{ project.staff.length > 1 ? 'Another' : '' }} Staff
          </el-button>
        </div>
      </el-scrollbar>

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
  <AddNewClient v-else inline @close="page = 'project'" />
</template>
