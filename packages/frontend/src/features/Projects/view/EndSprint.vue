<script setup lang="ts">
import type { CheckboxValueType, FormInstance, FormRules } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Modal from '@/shared/components/Modal.vue';

import { useDate } from '@/shared/composables/useDate'
import { useSprint } from '../composable/useSprints';
import { validateRequiredField } from '@/shared/utils/helpers';

const route = useRoute()
const router = useRouter()
const usesprint = useSprint()
const { format } = useDate()

const sprint = ref()
const form = ref({
  tasks: [],
  note: "",
  sid: ""
})
const loading = ref(true)
const submitting = ref(false)
const formRef = ref<FormInstance>()

const checkAll = ref()
const isIndeterminate = ref(true)

const sprints = computed(() => usesprint.sprints.value.filter((s) => (s?.id !== sprint.value?.id)))

const rules = reactive<FormRules<typeof form>>({
  sid: [{
    validator: (value: any, rule: any, callback: any) => {
      if (form.value.tasks.length !== 0) {
        validateRequiredField(form.value, 'sid', callback)
      }
    }, trigger: 'change'
  }]
})

const handleCheckAllChange = (val: CheckboxValueType) => {
  form.value.tasks = val ? sprint.value.tasks.map((task: any) => task.id) : []
  isIndeterminate.value = false
}

const handleCheckedTasksChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === sprint.value.tasks.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < sprint.value.tasks.length
}

async function getSprintById() {
  loading.value = true
  try {
    const { sprint: _sprint } = await usesprint.findSprintById(route.params.sprintId as string)

    sprint.value = _sprint
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false
  }
}

async function submitSprint(formEl: FormInstance | undefined) {
  if (!formEl) return

  await formEl.validate(async (valid, fields) => {
    if (!valid) {
      console.warn('invalid fields; ', fields)
      return
    }

    try {
      submitting.value = true
      await usesprint.endSprintById(route.params.sprintId as string, form.value);
      router.back()
    } catch (error) {
      console.error(error)
    } finally {
      submitting.value = false
    }
  })
}

onMounted(() => {
  getSprintById()
})
</script>

<template>
  <Modal heading="End Sprint" size="third" @close="$router.back()">
    <el-form v-loading="loading" :model="form" :rules ref="formRef" label-position="top" size="large">
      <el-scrollbar class="!h-[40vh] overflow-auto">
        <div class="" v-if="sprint">
          <h2 class="font-bold">{{ sprint?.title }}</h2>
          <div class="text-gray-300 text-sm">
            <p class="">
              {{ format(sprint.startDate, 'do MMM, yyy') }} -
              {{ format(sprint.endDate, 'do MMM, yyy') }}
            </p>
            <p class="line-clamp-1">
              Goal: {{ sprint?.goals }}
            </p>
          </div>
        </div>
        <div class="flex items-center justify-between border-b border-gray-50 py-1">
          <h3>Tasks:</h3>
          <div class="">
            <el-checkbox :disabled="sprints.length === 0" class="!font-[400]" v-model="checkAll"
              :indeterminate="isIndeterminate" @change="handleCheckAllChange">
              <template #default>
                Move all {{ sprint?.tasks.length }} tasks
              </template>
            </el-checkbox>
          </div>
        </div>
        <div class="my-3">
          <el-checkbox-group :disabled="sprints.length === 0" @change="handleCheckedTasksChange" size="large"
            class="flex flex-col" v-model="form.tasks">
            <el-checkbox class="!w-full h-auto !flex !items-start" v-for="(task, key) in sprint?.tasks" :value="task.id"
              :key>
              <template #default>
                <div class="flex flex-col">
                  <div class="">
                    <div class="flex gap-3 items-center">
                      <h3 class="capitalize">
                        {{ task.title }}
                      </h3>

                      <div class="text-xs font-[500] flex gap-1 px-2 border-l">
                        <span>Assigned to:</span>
                        {{ task.assignedTo.firstName }} {{ task.assignedTo.lastName }}
                      </div>
                    </div>
                    <p class="text-xs !font-[300]">
                      {{ task.description }}
                    </p>
                  </div>
                </div>
              </template>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <el-form-item label="Sprint to Move Tasks to" prop="sid">
          <el-select v-model="form.sid" placeholder="Sprint to move tasks to">
            <el-option v-for="(s, i) in sprints" :key="i" :value="s.id" :label="s.title"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Sprint Completion Notes (Optional)">
          <el-input type="textarea"
            placeholder="Enter sprint completion notes, lessons learned, or any important observations..."
            v-model="form.note" />
        </el-form-item>
      </el-scrollbar>
      <div class="flex justify-end mt-3 pt-5 border-t border-primary-50">
        <el-button @click="$router.back()">
          Cancel
        </el-button>
        <el-button :loading="submitting" type="primary" @click="submitSprint(formRef)">
          {{ form.tasks.length !== 0 ? "Move Tasks and " : "" }}
          End Sprint
        </el-button>
      </div>
    </el-form>
  </Modal>
</template>
