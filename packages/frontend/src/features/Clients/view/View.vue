<script lang="ts" setup>
import { ArrowLeftBold, DocumentChecked, Edit, Document, Search, View } from '@element-plus/icons-vue'
import { onMounted, ref, computed } from 'vue';
import { useClient } from '../composable/useClient';
import { useRoute, useRouter } from 'vue-router';
import { isEmpty } from 'lodash';

import { useDate } from '@/shared/composables/useDate'

const route = useRoute()
const router = useRouter()
const useclient = useClient()

const { format } = useDate()

const { oneclient } = useclient
const loading = ref(true)

const isSide = computed(() => route.meta.side)
const completedProjects = computed(() => {
  if (oneclient.value) {
    return oneclient.value.projects.filter((project: Record<string, string>) => (project.status === 'COMPLETED'))
  }
  else {
    return []
  }
})
const activeProjects = computed(() => {
  if (oneclient.value) {
    return oneclient.value.projects.filter((project: Record<string, string>) => (project.status !== 'COMPLETED'))
  }
  else {
    return []
  }
})

async function getClientById() {
  loading.value = true
  try {
    await useclient.fetchClientById(route.params.id as string)
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getClientById()
})
</script>

<template>
  <section class="" v-loading="loading">
    <div v-if="!isEmpty(oneclient)" class="">
      <div class="flex items-center justify-between mb-10">
        <div class="flex items-center cursor-pointer" @click="router.back()">
          <el-icon>
            <ArrowLeftBold />
          </el-icon>
          Back
        </div>

        <router-link v-if="!isSide" :to="{ name: 'edit-client' }">
          <el-button type="primary" size="large">
            <el-icon>
              <Edit />
            </el-icon>
            &nbsp;
            Edit
          </el-button>
        </router-link>

        <router-link v-else :to="{ name: 'view-client', params: { id: route.params.id } }">
          <el-button type="primary" size="large" text bg>
            <el-icon>
              <View />
            </el-icon>
            &nbsp;
            See Details
          </el-button>
        </router-link>
      </div>

      <el-scrollbar class="!h-[75vh] overflow-y-auto">
        <div class="flex flex-col gap-1" :class="{ '!gap-5' : !isSide }">
          <div class="border border-gray-50 bg-gray-50/20 p-5 rounded">
            <div class="">
              <h2 class="text-3xl capitalize">
                {{ oneclient.firstName }}
                {{ oneclient.lastName }}
              </h2>
              <p class="capitalize">
                {{ oneclient.company }}
              </p>
            </div>

            <div class="border-t border-gray-50 mt-3 pt-3 grid items-center grid-cols-5 gap-3 text-sm" v-if="!isSide">
              <div class="">
                <h3 class="opacity-50 text-xs">Email</h3>
                <p>{{ oneclient.email }}</p>
              </div>
              <div class="">
                <h3 class="opacity-50 text-xs">Phone Number</h3>
                <p>{{ oneclient.phoneNumber }}</p>
              </div>
              <div class="">
                <h3 class="opacity-50 text-xs">Industry</h3>
                <p>{{ oneclient.industry }}</p>
              </div>
              <div class="">
                <h3 class="opacity-50 text-xs">Address</h3>
                <p class="line-clamp-1">{{ oneclient.address || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <el-divider v-if="isSide" />

          <div class="grid grid-cols-3 gap-3" :class="{ '!grid-cols-1' : isSide }">
            <div class="border border-gray-50 bg-gray-50/20 p-5 rounded flex items-center justify-between">
              <div class="">
                <h3 class="text-xl">
                  {{ oneclient.projects.length }}
                </h3>
                <p class="opacity-50">Projects</p>
              </div>

              <div class="px-3 py-2 bg-primary-50 rounded-full flexx items-center justify-center">
                <el-icon color="primary">
                  <Document />
                </el-icon>
              </div>
            </div>

            <div class="border border-gray-50 bg-gray-50/20 p-5 rounded flex items-center justify-between">
              <div class="">
                <h3 class="text-xl">
                  {{ activeProjects.length }}
                </h3>
                <p class="opacity-50">Active Projects</p>
              </div>

              <div class="px-3 py-2 bg-primary-50 rounded-full flexx items-center justify-center">
                <el-icon color="primary">
                  <Document />
                </el-icon>
              </div>
            </div>

            <div class="border border-gray-50 bg-gray-50/20 p-5 rounded flex items-center justify-between">
              <div class="">
                <h3 class="text-xl">
                  {{ completedProjects.length }}
                </h3>
                <p class="opacity-50">Completed Projects</p>
              </div>

              <div class="px-3 py-2 bg-primary-50 rounded-full flexx items-center justify-center">
                <el-icon color="primary">
                  <DocumentChecked />
                </el-icon>
              </div>
            </div>
          </div>

          <div class="mt-5 flex flex-col gap-5">
            <div class="flex items-center justify-between border-b border-gray-50 pb-3">
              <h3 class="text-xl">
                Projects
              </h3>
              <router-link :to="{ name: 'new-project', query: { clientId: oneclient.id, clientName: `${oneclient.firstName}+${oneclient.lastName}` } }">
                <el-button type="primary" size="large" :plain="!isSide">
                  Add Project
                </el-button>
              </router-link>
            </div>

            <div class="grid gap-3">
              <div v-for="(project, key) in oneclient.projects" :key class="flex items-center justify-between border border-gray-50/70 rounded p-5" :class="{ 'flex-col items-start gap-3' : isSide }">
                <div class="">
                  <div class="flex items-center gap-3">
                    <h3 class="text-lg">
                      {{ project.title }}
                    </h3>

                    <el-tag class="capitalize" :type="project.status === 'COMPLETED' ? 'success' : 'primary'" size="small" :effect="project.status === 'COMPLETED' ? 'dark' : 'light'">
                      {{ project.status.replaceAll("_", " ").toLowerCase() }}
                    </el-tag>
                  </div>
                  <p class="text-gray-300 text-sm">
                    Start Date: {{ format(project.startDate, 'do MMM, yyy') }}
                  </p>
                </div>

                <router-link :to="{ name: 'view-project', params: { id: project.id} }">
                  <el-button type="primary" size="large" bg text>
                    View Project
                  </el-button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </section>
</template>
