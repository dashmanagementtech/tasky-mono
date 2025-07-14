<script lang="ts" setup>
import { Edit, Search, View } from '@element-plus/icons-vue'
import { debounce } from 'lodash'
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useDate } from '@/shared/composables/useDate'
import { useClient } from '../composable/useClient'

const route = useRoute()
const router = useRouter()

const useclient = useClient()
const { keyword, loading, meta, clients } = useclient

const { format } = useDate()

const isSidePage = computed(() => {
  return route.meta.side
})

async function getClients() {
  await useclient.fetchAllClients()
}

watch(keyword, () => {
  debounce(async () => {
    meta.page = 1
    meta.size = 10

    await useclient.searchClient(keyword.value)
  }, 500)()
})

onMounted(async () => {
  await getClients()
})
</script>

<template>
  <section class="flex" :class="{ 'gap-5': isSidePage }">
    <div class="w-full transition ease-in-out" :class="{ '!w-3/4': isSidePage }">
      <div class="flex items-center justify-between">
        <div class="">
          <router-link :to="{ name: 'new-client' }">
            <el-button type="primary" size="large">
              New Client
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

      <div class="mt-10 py-5 borderb- border-primary-50 overflow-hidden">
        <el-table
          v-loading="loading"
          style="width: 100%"
          height="550"
          stripe
          :data="clients"
        >
          <el-table-column prop="createdAt" label="Date Added" width="150" show-overflow-tooltip>
            <template #default="{ row }">
              {{ format(row.createdAt, 'do MMM, yyy') }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Name" width="200" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.firstName }} {{ row.lastName }}
            </template>
          </el-table-column>
          <el-table-column prop="projects" label="Company" width="200" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.company }}
            </template>
          </el-table-column>
          <el-table-column prop="email" label="Email" width="200" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.email }}
            </template>
          </el-table-column>
          <el-table-column prop="phoneNumber" label="Phone Number" width="200" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.phoneNumber }}
            </template>
          </el-table-column>
          <el-table-column prop="projects" label="Projects" width="100" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.projects?.length }} Projects
            </template>
          </el-table-column>

          <el-table-column label="Action">
            <template #default="{ row }">
              <div class="flex gap-3">
                <router-link :to="{ name: 'peek-client', params: { id: row.id } }">
                  <el-icon color="#69131b">
                    <View />
                  </el-icon>
                </router-link>

                <router-link :to="{ name: 'edit-client', params: { id: row.id } }">
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
              getClients();
            }"
            @current-change="(page: any) => {
              meta.page = page;
              getClients();
            }"
          />
        </div>
      </div>
    </div>

    <div class="h-[90vh] overflow-auto" :class="{ 'border-l border-primary-50 bg-primary-50/10 p-5 w-1/4': isSidePage }">
      <RouterView :key="$route.fullPath" />
    </div>
  </section>
</template>
