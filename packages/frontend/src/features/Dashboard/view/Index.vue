<script lang="ts" setup>
import { Calendar, Document } from '@element-plus/icons-vue';
import { computed, onMounted } from 'vue';

import { useAuthStore } from '@/features/Auth/store/useAuthStore';
import { useDashoard } from '../composables/useDashboard';
import { useDate } from '@/shared/composables/useDate';

const usedashboard = useDashoard()
const { user } = useAuthStore()
const { format } = useDate()

const tasks = computed(() => usedashboard.tasks.value)
const tasksAnalytics = computed(() => usedashboard.tasksAnalytics.value)
const upcoming = computed(() => usedashboard.upcoming.value)

onMounted(async () => {
  usedashboard.loadTasksAnalytics()
  usedashboard.loadUpcomingTasks()
  usedashboard.loadTasks()
})
</script>

<template>
  <section class="">
    <div class="">
      <h1 class="font-bold text-xl capitalize">
        Welcome Back, {{ user.firstName }}
      </h1>
      <p class="opacity-65">
        Here's what's happening with your tasks today.
      </p>
    </div>

    <div v-loading="tasksAnalytics.loading" class="my-10 grid grid-cols-4 gap-5">
      <div class="rounded-2xl border border-gray-50 p-5 flex justify-between">
        <div class="">
          <h2 class="text-lg font-semibold">{{ tasksAnalytics.total }}</h2>
          <p class="opacity-50">Total Tasks</p>
        </div>
        <div class="inline-flex items-center justify-center py-3 px-3.5 rounded-full bg-primary-50">
          <el-icon size="24" color="#69131B">
            <Document />
          </el-icon>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-50 p-5 flex justify-between">
        <div class="">
          <h2 class="text-lg font-semibold">{{ tasksAnalytics.active }}</h2>
          <p class="opacity-50">Active Tasks</p>
        </div>
        <div class="inline-flex items-center justify-center py-3 px-3.5 rounded-full bg-[#2563EB]/20">
          <el-icon size="24" color="#2563EB">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.3332 10H14.9998L12.4998 17.5L7.49984 2.5L4.99984 10H1.6665" stroke="#2563EB"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </el-icon>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-50 p-5 flex justify-between">
        <div class="">
          <h2 class="text-lg font-semibold">{{ tasksAnalytics.completed }}</h2>
          <p class="opacity-50">Completed Tasks</p>
        </div>
        <div class="inline-flex items-center justify-center py-3 px-3.5 rounded-full bg-[#06962F]/20">
          <el-icon size="24" color="#06962F">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_978_26109)">
                <path
                  d="M18.3332 9.23843V10.0051C18.3321 11.8021 17.7503 13.5507 16.6743 14.99C15.5983 16.4292 14.0859 17.4822 12.3626 17.9917C10.6394 18.5012 8.79755 18.44 7.1119 17.8172C5.42624 17.1945 3.98705 16.0435 3.00897 14.536C2.03089 13.0285 1.56633 11.2451 1.68457 9.45202C1.80281 7.6589 2.49751 5.95203 3.66507 4.58599C4.83263 3.21994 6.41049 2.26791 8.16333 1.87188C9.91617 1.47585 11.7501 1.65704 13.3915 2.38843M18.3332 3.33366L9.99984 11.6753L7.49984 9.17533"
                  stroke="#06962F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_978_26109">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>

          </el-icon>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-50 p-5 flex justify-between">
        <div class="">
          <h2 class="text-lg font-semibold">{{ tasksAnalytics.productivity }}%</h2>
          <p class="opacity-50">Productivity</p>
        </div>
        <div class="inline-flex items-center justify-center py-3 px-3.5 rounded-full bg-[#9747FF]/20">
          <el-icon size="24" color="#9747FF">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.8335 1.66699L3.41142 10.5735C3.12075 10.9223 2.97541 11.0967 2.97319 11.244C2.97126 11.3721 3.02832 11.4939 3.12792 11.5744C3.2425 11.667 3.46952 11.667 3.92357 11.667H10.0002L9.16688 18.3337L16.589 9.42712C16.8797 9.07831 17.025 8.9039 17.0272 8.75661C17.0292 8.62856 16.9721 8.50674 16.8725 8.42625C16.7579 8.33366 16.5309 8.33366 16.0768 8.33366H10.0002L10.8335 1.66699Z"
                stroke="#9747FF" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </el-icon>
        </div>
      </div>
    </div>

    <div class="my-10 grid grid-cols-2 gap-5">
      <div class="rounded-2xl bg-white flex flex-col gap-5">
        <h2 class="font-semibold text-lg">Upcoming Deadlines</h2>
        <div v-loading="upcoming.loading" class="flex flex-col gap-3">
          <template v-if="upcoming?.items?.length !== 0">
            <div v-for="(task, key) in upcoming.items" :key
              class="rounded-xl border border-gray-50 flex gap-2 items-start justify-between p-5">
              <div class="flex gap-3 items-start">
                <el-icon size="24" color="#69131B">
                  <Calendar />
                </el-icon>
                <div class="flex flex-col">
                  <div>
                    <h3 class="font-[500] text-lg line-clamp-1">{{ task?.title }}</h3>
                    <p class="line-clamp-1 opacity-70">{{ task?.sprint?.project?.title }}</p>
                  </div>
                  <p class="text-xs opacity-70">Due: {{ format(task?.dueDate, "do MMM, yyy") }}</p>
                </div>
              </div>
              <router-link
                :to="{ name: 'view-sprint-task', params: { id: task.sprint.project.id, sprintId: task?.sid, taskId: task?.id } }">
                <el-button type="primary" text>
                  View Details
                </el-button>
              </router-link>
            </div>
          </template>
          <div v-else class="opacity-50 text-sm">
            All done, nothing here.
          </div>
        </div>
      </div>

      <div class="rounded-2xl bg-white flex flex-col gap-5">
        <h2 class="font-semibold text-lg">Recent Activities</h2>
        <div v-loading="upcoming.loading" class="flex flex-col gap-3">
          <div v-for="(task, key) in upcoming.items" :key
            class="rounded-xl border border-gray-50 flex gap-2 items-start justify-between p-5">
            <div class="flex gap-3 items-start">
              <el-icon size="24" color="#69131B">
                <Calendar />
              </el-icon>
              <div class="flex flex-col">
                <div>
                  <h3 class="font-[500] text-lg line-clamp-1">{{ task.title }}</h3>
                  <p class="line-clamp-1 opacity-70">{{ task.sprint.project.title }}</p>
                </div>
                <p class="text-xs opacity-70">Due: {{ format(task.dueDate, "do MMM, yyy") }}</p>
              </div>
            </div>
            <el-button type="primary" text>
              View Details
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-5">
      <h2 class="font-semibold text-lg">Your Tasks</h2>
      <el-table v-loading="tasks.loading" style="width: 100%;" height="500" stripe :data="tasks.items">
        <el-table-column prop="createdAt" label="Date Added" width="150">
          <template #default="{ row }">
            {{ format(row.createdAt, 'do MMM, yyy') }}
          </template>
        </el-table-column>

        <el-table-column prop="title" label="Title" width="150">
          <template #default="{ row }">
            <router-link
              :to="{ name: 'view-sprint-task', params: { taskId: row.id, sprintId: row.sid, id: row.sprint.pid } }"
              class="text-blue-500 underline">
              {{ row.title }}
            </router-link>
          </template>
        </el-table-column>

        <el-table-column prop="description" label="Description" width="350" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.description }}
          </template>
        </el-table-column>

        <el-table-column prop="startDate" label="Start Date" width="150">
          <template #default="{ row }">
            {{ format(row.startDate, 'do MMM, yyy') }}
          </template>
        </el-table-column>

        <el-table-column prop="dueDate" label="Due Date" width="150">
          <template #default="{ row }">
            {{ format(row.dueDate, 'do MMM, yyy') }}
          </template>
        </el-table-column>

        <el-table-column prop="status" label="Status">
          <template #default="{ row }">
            <el-tag class="capitalize">
              {{ row.status.replace("_", " ").toLowerCase() }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>
