<script lang="ts" setup>
import { View } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useDate } from '@/shared/composables/useDate'
import { useProject } from '../composable/useProjects'

const route = useRoute()
const useproject = useProject()
const { format } = useDate()

const { findDocumentsByProjectId, documents } = useproject

const loading = ref(true)

async function getDocuments() {
  loading.value = true
  await findDocumentsByProjectId(route.params.id as string)
  loading.value = false
}

onMounted(() => {
  getDocuments()
})
</script>

<template>
  <div v-loading="loading" class="bg-grey-50/20 rounded-xl p-5">
    <div class="border-gray-100 border-b pb-3 mb-3 flex items-center justify-end">
      <div v-if="!route.meta.side" class="flex gap-4">
        <router-link :to="{ name: 'add-document' }">
          <el-button type="primary" size="large">
            Add Document
          </el-button>
        </router-link>
      </div>
    </div>

    <div v-if="documents.length === 0" class="text-gray-300">
      No document added for this project, yet.
      <router-link class="text-gray-500 underline" :to="{ name: 'add-document', params: { id: route.params.id } }">
        Add document to project
      </router-link>
    </div>
    <div v-else class="grid gap-3">
      <div v-for="(document, key) in documents" :key
        class="border border-gray-50 rounded-xl p-5 flex justify-between items-center">
        <div class="flex gap-5 items-center">
          <svg width="18" height="23" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11 1.76953V5.90007C11 6.46012 11 6.74015 11.109 6.95406C11.2049 7.14222 11.3578 7.2952 11.546 7.39108C11.7599 7.50007 12.0399 7.50007 12.6 7.50007H16.7305M13 12.5H5M13 16.5H5M7 8.5H5M11 1.5H5.8C4.11984 1.5 3.27976 1.5 2.63803 1.82698C2.07354 2.1146 1.6146 2.57354 1.32698 3.13803C1 3.77976 1 4.61984 1 6.3V16.7C1 18.3802 1 19.2202 1.32698 19.862C1.6146 20.4265 2.07354 20.8854 2.63803 21.173C3.27976 21.5 4.11984 21.5 5.8 21.5H12.2C13.8802 21.5 14.7202 21.5 15.362 21.173C15.9265 20.8854 16.3854 20.4265 16.673 19.862C17 19.2202 17 18.3802 17 16.7V7.5L11 1.5Z"
              stroke="#1B1B1B" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <div class="flex flex-col">
            <div class="flex gap-3">
              <h3>{{ document.title }}</h3>
            </div>
            <div class="text-gray-300 text-sm flex gap-3">
              <div class="">
                Uploaded at: <span class="text-gray-500">{{ document.uploaded ? format(document.uploaded, 'do MMM, yyy')
                  :
                  'n/a' }}</span>
              </div>
            </div>
          </div>
        </div>
        <a :href="document.url" target="_blank">
          <el-button :icon="View" type="primary" size="large" plain bg text>
          </el-button>
        </a>
      </div>
    </div>
  </div>
</template>
