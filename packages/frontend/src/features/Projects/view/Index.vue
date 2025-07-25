<script lang="ts" setup>
import { ArrowLeftBold, Edit, Search, View } from '@element-plus/icons-vue'
import { debounce } from 'lodash'
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useDate } from '@/shared/composables/useDate'

import { useProject } from '../composable/useProjects'

const route = useRoute()
const router = useRouter()

const useproject = useProject()
const { keyword, loading, meta, projects } = useproject

const { format } = useDate()

const isSidePage = computed(() => {
  return route.meta.side
})

async function getProjects() {
  await useproject.fetchAllProjects()
}

watch(keyword, () => {
  debounce(async () => {
    meta.page = 1
    meta.size = 10
    await useproject.searchProjectByKeyword()
  }, 500)()
})

onMounted(async () => {
  await getProjects()
})
</script>

<template>
  <section class="flex" :class="{ 'gap-5': isSidePage }">
    <div class="w-full transition ease-in-out" :class="{ '!w-3/4': isSidePage }">
      <div class="flex items-center justify-between">
        <div class="flex gap-5">
          <router-link :to="{ name: 'new-project' }">
            <el-button type="primary" size="large">
              New Project
            </el-button>
          </router-link>
        </div>

        <div class="">
          <el-input v-model="keyword" size="large" placeholder="Search here...">
            <template #prefix>
              <el-icon class="el-input__icon">
                <search />
              </el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <div class="mt-10 py-5 border-b border-primary-50 overflow-hidden">
        <el-table
          v-loading="loading"
          style="width: 100%"
          height="550"
          stripe
          :data="projects"
        >
          <el-table-column prop="id" label="Date Added" width="150" show-overflow-tooltip>
            <template #default="{ row }">
              {{ format(row.createdAt, 'do MMM, yyy') }}
            </template>
          </el-table-column>

          <el-table-column prop="title" label="Name" width="200">
            <template #default="{ row }">
              {{ row.title }}
            </template>
          </el-table-column>

          <el-table-column prop="type" label="Type" width="150" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.type.replace("_", " ") }}
            </template>
          </el-table-column>

          <el-table-column prop="cuid" label="Client" width="200">
            <template #default="{ row }">
              {{ row.client.firstName }} {{ row.client.lastName }}
            </template>
          </el-table-column>

          <el-table-column prop="status" label="Status" width="100">
            <template #default="{ row }">
              <el-tag class="capitalize">
                {{ row.status.replace("_", " ").toLowerCase() }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="startDate" label="Start Date" width="150">
            <template #default="{ row }">
              {{ format(row.startDate, 'do MMM, yyy') }}
            </template>
          </el-table-column>

          <el-table-column prop="endDate" label="End Date" width="150">
            <template #default="{ row }">
              {{ format(row.endDate, 'do MMM, yyy') }}
            </template>
          </el-table-column>

          <el-table-column label="Action">
            <template #default="{ row }">
              <div class="flex gap-3">
                <router-link :to="{ name: 'peek-project', params: { id: row.id } }">
                  <el-icon color="#69131b">
                    <View />
                  </el-icon>
                </router-link>

                <router-link :to="{ name: 'edit-project', params: { id: row.id } }">
                  <el-icon color="#69131b">
                    <Edit />
                  </el-icon>
                </router-link>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="flex justify-end mt-5">
          <el-pagination
            v-model:current-page="meta.page"
            v-model:page-size="meta.size"
            :page-sizes="[10, 20, 30, 40]"
            background
            layout="sizes, prev, pager, next"
            :total="meta.total"
            @size-change="(size: any) => {
              meta.size = size;
              getProjects();
            }"
            @current-change="(page: any) => {
              meta.page = page;
              getProjects();
            }"
          />
        </div>
      </div>
    </div>

    <div class="h-[90vh] overflow-auto" :class="{ 'border-l border-primary-50 bg-primary-50/10 p-5 w-1/4': isSidePage }">
      <div v-if="isSidePage" class="text-[#fb2c36] flex items-center cursor-pointer mb-10" @click="router.back()">
        <el-icon color="#fb2c36">
          <ArrowLeftBold />
        </el-icon>
        Back
      </div>
      <RouterView :key="$route.fullPath" />
    </div>
  </section>
</template>
