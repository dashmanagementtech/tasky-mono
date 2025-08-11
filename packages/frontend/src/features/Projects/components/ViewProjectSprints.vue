<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { useSprint } from '../composable/useSprints';

import SprintCard from './SprintCard.vue';

const route = useRoute()
const usesprint = useSprint()

const { loading, sprints } = usesprint

async function getAllSprints() {
  await usesprint.fetchAllSprintsByProjectId(route.params.id as string)
}

onMounted(() => {
  getAllSprints()
})
</script>

<template>
  <div class="bg-gray-50/20 rounded-xl p-5" v-loading="loading">
    <div class="border-gray-100 border-b pb-3 mb-3 flex items-center justify-end">
      <div class="flex gap-4" v-if="!route.meta.side">
        <router-link :to="{ name: 'add-task' }">
          <el-button size="large">
            Create Task
          </el-button>
        </router-link>
        <router-link :to="{ name: 'add-sprint' }">
          <el-button type="primary" size="large">
            Add Sprint
          </el-button>
        </router-link>
      </div>
    </div>

    <div v-if="sprints.length === 0" class="opacity-60">
      Sorry, no sprint added yet.
    </div>

    <div v-else class="">
      <SprintCard v-for="(sprint, key) in sprints" :key :sprint />
    </div>
  </div>
</template>
