<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';

import { useStaff } from '../composable/useStaff'

const route = useRoute()
const usestaff = useStaff()

const loading = ref(false)
const { onestaff: staff } = usestaff

async function getStaffById() {
  loading.value = true
  try {
    await usestaff.fetchStaffById(route.params.id as string)

  } catch(error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getStaffById()
})
</script>

<template>
  <section class="" v-loading="loading">
    <h2 class="font-semibold text-2xl">
      {{ staff?.firstName }} {{ staff?.lastName }}
    </h2>
    <p class="capitalize">
      {{ staff?.role?.toLowerCase() }}
    </p>
  </section>
</template>
