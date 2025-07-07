<script lang="ts" setup>
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { ref } from 'vue'

import { useDate } from '@/shared/composables/useDate'
import { TAG_TYPES } from '@/shared/utils/constants'

const { sprint } = defineProps<{ sprint: Record<string, any> }>()
const { format } = useDate()

const isOpened = ref(false)
</script>

<template>
  <div class="border-b border-gray-50 py-5">
    <div class="flex justify-between items-center">
      <div class="flex flex-col">
        <div class="">
          <h3 class="text-lg font-semibold text-primary">
            {{ sprint.title }}
          </h3>
          <p class="text-sm text-gray-300">
            {{ format(sprint.startDate, 'do MMM, yyy') }} -
            {{ format(sprint.endDate, 'do MMM, yyy') }}
          </p>
        </div>
      </div>

      <div class="text-gray-300 cursor-pointer flex items-center text-sm" @click="isOpened = !isOpened">
        Goal: {{ sprint.goals }}

        <el-icon class="ml-2">
          <ArrowDown v-if="!isOpened" />
          <ArrowUp v-else />
        </el-icon>
      </div>
    </div>

    <div v-if="isOpened" class="mt-3">
      <div v-if="sprint.tasks.length === 0" class="text-gray-300">
        No tasks scheduled for this sprint, yet.
        <router-link class="text-gray-500 underline" :to="{ name: 'add-task-to-sprint', params: { sprintId: sprint.id } }">
          Add task to sprint
        </router-link>
      </div>
      <div v-else class="grid gap-3">
        <div class="border border-gray-50 rounded-xl p-5 flex justify-between items-center" v-for="(task, key) in sprint.tasks" :key>
          <div class="flex flex-col">
            <div class="flex gap-3">
              <h3>{{ task.title }}</h3>
              <el-tag size="small" class="capitalize" :type="TAG_TYPES[task.status as 'TO_DO']">
                {{ task.status.toLowerCase().replace('_', ' ') }}
              </el-tag>
            </div>
            <div class="text-gray-300 text-sm flex gap-3">
              <div class="">
                Staff Assigned: <span class="text-gray-500">{{ task.assignedTo.firstName }} {{ task.assignedTo.lastName }}</span>
              </div>
              |
              <div class="">
                Due Date: <span class="text-gray-500">{{format(task.dueDate, 'do MMM, yyy') }}</span>
              </div>
            </div>
          </div>
          <router-link :to="{ name: 'view-sprint-task', params: { id: sprint.pid, sprintId: sprint.id, taskId: task.id }}">
            <el-button type="primary" size="large" plain bg text>
              View Details
            </el-button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
