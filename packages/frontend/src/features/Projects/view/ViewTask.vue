<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Modal from '@/shared/components/Modal.vue'
import { useDate } from '@/shared/composables/useDate'
import { TAG_TYPES, STATUS } from '@/shared/utils/constants'
import { useSprint } from '../composable/useSprints'

const router = useRouter()
const route = useRoute()
const { format } = useDate()
const usesprint = useSprint()

const loading = ref(true)
const statusLoading = ref(false)
const statusRef = ref()
const task = ref<Record<string, any>>({})
const pid = computed(() => route.params.id)

async function fetchTaskById() {
  loading.value = true

  try {
    const { task: _task } = await usesprint.findTaskById(route.params.taskId as string)
    task.value = _task
  }
  catch (error) {
    console.error(error)
  }
  finally {
    loading.value = false
  }
}

async function updateStatus(val: string[]) {
  task.value.status = val[0]
  statusLoading.value = true
  statusRef.value.blur()

  try {
    const { task: _task } = await usesprint.updateTaskById(route.params.taskId as string, { status: task.value.status })
    task.value = _task
  } catch (error) {
    console.error(error)
  } finally {
    statusLoading.value = false
  }
}

onMounted(() => {
  fetchTaskById()
})
</script>

<template>
  <Modal v-loading="loading" :heading="task.title" :subheading="task.sprint ? `Sprint: ${task?.sprint?.title}` : ''" size="large" @close="router.push({ name: 'view-project', params: { id: pid } })">
    <el-scrollbar v-if="task.title" class="!h-[50vh] overflow-y-auto">
      <div class="border-b border-gray-50/50 grid grid-cols-2 gap-3 pb-3">
        <div class="">
          <h4 class="text-xs text-gray-300">Title</h4>
          {{ task.title }}
        </div>

        <div class="">
          <h4 class="text-xs text-gray-300">Staff Assigned</h4>
          <router-link :to="{ name: 'view-staff', params: { id: task.uid }, query: { tab: 'projects', pid }}" class="text-primary">
            {{ task.assignedTo.firstName }} {{ task.assignedTo.lastName }}
          </router-link>
        </div>

        <div class="">
          <h4 class="text-xs text-gray-300">Due Date</h4>
          {{ format(task.dueDate, 'do MMM, yyy') }}
        </div>

        <div class="">
          <h4 class="text-xs text-gray-300">Status</h4>
          <el-select ref="statusRef" multiple :multiple-limit="1" v-model="task.status" @change="updateStatus" v-loading="statusLoading">
            <el-option v-for="(status, key) in STATUS.filter((type: any) => type.scope.includes('task'))" :key v-bind="status" />
            <template #tag>
              <el-tag :type="TAG_TYPES[task.status as 'TO_DO']" class="capitalize">
                {{ task.status?.toLowerCase().replaceAll('_', ' ') }}
              </el-tag>
            </template>
          </el-select>
        </div>
      </div>
      <div class="mt-3">
        <h4 class="text-xs text-gray-300">Description</h4>
        <p class="whitespace-pre">
          {{ task.description }}
        </p>
      </div>
    </el-scrollbar>
  </Modal>
</template>
