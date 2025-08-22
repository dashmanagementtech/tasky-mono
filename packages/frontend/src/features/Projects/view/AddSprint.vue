<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Modal from '@/shared/components/Modal.vue'

import { validateRequiredField } from '@/shared/utils/helpers'
import { useSprint } from '../composable/useSprints';

const router = useRouter()
const route = useRoute()
const usesprint = useSprint()

const { submitting } = usesprint
const sprintForm = ref<FormInstance>()

const sprint = reactive({
  pid: route.params.id,
  title: '',
  startDate: '',
  endDate: '',
  goals: '',
})

function disabledDate(time: Date) {
  return time.getTime() < new Date(sprint.startDate).getTime()
}

const rules = reactive<FormRules<typeof sprint>>({
  title: [{ validator: (val: any, rule: any, callback: any) => {
    validateRequiredField(sprint, 'title', callback)
  }, trigger: 'change' }],
  startDate: [{ validator: (val: any, rule: any, callback: any) => {
    validateRequiredField(sprint, 'startDate', callback)
  }, trigger: 'change' }],
  endDate: [{ validator: (val: any, rule: any, callback: any) => {
    validateRequiredField(sprint, 'endDate', callback)
  }, trigger: 'change' }],
  goals: [{ validator: (val: any, rule: any, callback: any) => {
    validateRequiredField(sprint, 'goals', callback)
  }, trigger: 'change' }],
})

async function submitSprint(formEl: FormInstance | undefined) {
  if (!formEl) return

  await formEl.validate(async (valid, fields) => {
    if (!valid) {
      console.warn('Invalid fields: ', fields)
      return
    }

    await usesprint.createSprint(sprint)
    router.back()
  })
}
</script>

<template>
  <Modal heading="Add New Sprint" size="third" @close="$router.back()">
    <el-form ref="sprintForm" :model="sprint" :rules label-position="top" size="large">
      <el-form-item prop="title" label="Title">
        <el-input v-model="sprint.title" placeholder="Sprint Title" />
      </el-form-item>

      <div class="grid gap-5 grid-cols-2">
        <el-form-item prop="startDate" label="Start Date">
          <el-date-picker v-model="sprint.startDate" class="w-full" placeholder="Sprint start date" />
        </el-form-item>
        <el-form-item prop="endDate" label="End Date">
          <el-date-picker v-model="sprint.endDate" class="w-full" placeholder="Sprint end date" :disabled-date="disabledDate" />
        </el-form-item>
      </div>

      <el-form-item prop="goals" label="Sprint Goal">
        <el-input type="textarea" v-model="sprint.goals" placeholder="Sprint goal" />
      </el-form-item>

      <div class="flex justify-end mt-3 pt-5 border-t border-primary-50">
        <el-button @click="$router.back()">
          Cancel
        </el-button>
        <el-button :loading="submitting" type="primary" @click="submitSprint(sprintForm)">
          Add Sprint
        </el-button>
      </div>
    </el-form>
  </Modal>
</template>
