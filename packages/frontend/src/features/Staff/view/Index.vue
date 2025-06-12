<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { useStaff } from '../composable/useStaff'
import { reactive, ref, onMounted } from 'vue'

const usestaff = useStaff()
const { keyword, loading } = usestaff

const staff = ref([])
const meta = reactive({
  page: 1,
  size: 10,
  total: 0,
})

async function getStaff() {
  const { count, staff: _staff } = await usestaff.fetchAllStaff({ page: meta.page - 1, size: meta.size })

  meta.total = count
  staff.value = _staff
}

onMounted(async () => {
  await getStaff();
})
</script>

<template>
  <section class="">
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

    <div class="mt-10 py-5 border-b border-primary-50 rounded overflow-hidden">
      <el-table
        style="width: 100%"
        :loading
        stripe
        :data="staff"
      >
        <el-table-column prop="firstName" label="Name">
          <template #default="{ row }">
            {{ row.firstName }} {{ row.lastName }}
          </template>
        </el-table-column>

        <el-table-column prop="email" label="Email">
          <template #default="{ row }">
            {{ row.email }}
          </template>
        </el-table-column>

        <el-table-column prop="firstName" label="Role">
          <template #default="{ row }">
            {{ row.role }}
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-end mt-5">
        <el-pagination
          v-model:current-page="meta.page"
          v-model:page-size="meta.size"
          :page-sizes="[10, 20, 30, 40]"
          :size="meta.size"
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
  </section>
  <RouterView />
</template>
