<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useClient } from '../composable/useClient';
import { useRoute } from 'vue-router';


const route = useRoute()
const useclient = useClient()

const { oneclient } = useclient
const loading = ref(true)

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
  <section class="">
    View Client
  </section>
</template>
