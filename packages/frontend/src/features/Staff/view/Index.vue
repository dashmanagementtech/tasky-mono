<script lang="ts" setup>
import { ArrowLeftBold, Search, View } from '@element-plus/icons-vue'
import { debounce } from 'lodash'
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useStaff } from '../composable/useStaff'

const route = useRoute()
const router = useRouter()

const usestaff = useStaff()
const { keyword, loading, meta, staff } = usestaff

const isSidePage = computed(() => {
  return route.meta.side
})

async function getStaff() {
  await usestaff.fetchAllStaff()
}

watch(keyword, () => {
  debounce(async () => {
    meta.page = 1
    meta.size = 10
    await usestaff.searchStaffByKeyword()
  }, 500)()
})

onMounted(async () => {
  await getStaff();
})
</script>

<template>
  <section class="flex" :class="{ 'gap-5' : isSidePage }">
    <div class="w-full transition ease-in-out" :class="{ '!w-3/4' : isSidePage }">
      <div class="flex items-center justify-between">
        <div class="flex gap-5">
          <router-link :to="{ name: 'invite-staff' }">
            <el-button type="primary" size="large">
              Invite Staff
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
          style="width: 100%"
          v-loading="loading"
          height="550"
          stripe
          :data="staff"
        >
          <el-table-column prop="id" label="Staff ID" width="150" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.id }}
            </template>
          </el-table-column>

          <el-table-column prop="firstName" label="Name" width="300">
            <template #default="{ row }">
              {{ row.firstName }} {{ row.lastName }}
            </template>
          </el-table-column>

          <el-table-column prop="email" label="Email" width="500" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.email }}
            </template>
          </el-table-column>

          <el-table-column prop="role" label="Role" width="100">
            <template #default="{ row }">
              {{ row.role }}
            </template>
          </el-table-column>

          <el-table-column label="Action">
            <template #default="{ row }">
              <div class="">
                <router-link :to="{ name: 'peek-staff', params: { id: row.id } }">
                  <el-icon color="#69131b">
                    <View />
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
              getStaff();
            }"
            @current-change="(page: any) => {
              meta.page = page;
              getStaff();
            }"
          />
      </div>
      </div>
    </div>
    <div :class="{ 'border-l border-primary-50 px-5 w-1/4' : isSidePage }">
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
